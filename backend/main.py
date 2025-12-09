from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, Message
from schemas import UserCreate, UserOut, Token, MessageCreate, MessageOut
from auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm

# Cria as tabelas no banco de dados se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoExplorador - Comunidade")

# Configuração de CORS para permitir que o frontend (HTML) converse com o backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite qualquer origem (para desenvolvimento local)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para pegar a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post('/register', response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail='Este nome de usuário já existe.')
    new_user = User(username=user.username, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/token', response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Usuário ou senha incorretos')
    access_token = create_access_token(data={'sub': user.username})
    return {'access_token': access_token, 'token_type': 'bearer'}

@app.get('/users/me', response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post('/messages', response_model=MessageOut)
def create_message(msg: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Aqui salvamos o nome do usuário junto (opcional, mas bom para exibição rápida)
    m = Message(user_id=current_user.id, content=msg.content)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@app.get('/messages', response_model=list[MessageOut])
def list_messages(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()

@app.delete('/messages/{message_id}', status_code=204)
def delete_message(message_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    m = db.query(Message).filter(Message.id==message_id).first()
    if not m:
        raise HTTPException(status_code=404, detail='Mensagem não encontrada')
    if m.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Você só pode apagar suas próprias mensagens')
    db.delete(m)
    db.commit()
    return None