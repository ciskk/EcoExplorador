import os

def compilar_scripts_recursivamente():
    """
    Encontra todos os arquivos .py, .cpp, .h, .qrc, .qss e .json no diretório atual E EM TODAS AS SUBPASTAS
    (exceto ele mesmo), e junta seu conteúdo em um único arquivo de texto.
    """
    caminho_raiz = os.getcwd()
    nome_deste_script = os.path.basename(__file__)
    arquivo_de_saida = 'codigo_compilado.txt'
    extensoes_alvo = ('.html', '.css', '.json', '.js')
    separador = "\n" * 10
    
    print(f"Iniciando busca recursiva por scripts em: {caminho_raiz}")
    
    # Abrir o arquivo de saída no modo de escrita ('w') para começar do zero
    with open(arquivo_de_saida, 'w', encoding='utf-8') as f_saida:
        print(f"Arquivo '{arquivo_de_saida}' criado/limpo. Adicionando códigos...")

        # os.walk() é a função mágica que percorre a árvore de diretórios
        for root, dirs, files in os.walk(caminho_raiz):
            for nome_arquivo in files:
                # Verifica se o arquivo termina com uma das extensões alvo e não é o próprio script
                if nome_arquivo.endswith(extensoes_alvo) and nome_arquivo != nome_deste_script:
                    
                    # Monta o caminho completo do arquivo
                    caminho_completo = os.path.join(root, nome_arquivo)
                    
                    # Pega o caminho relativo (mais limpo para o cabeçalho)
                    caminho_relativo = os.path.relpath(caminho_completo, caminho_raiz)
                    
                    try:
                        # Escreve o cabeçalho com o caminho do arquivo
                        f_saida.write(f"{caminho_relativo}:\n\n")

                        # Abre o arquivo para leitura
                        with open(caminho_completo, 'r', encoding='utf-8') as f_entrada:
                            conteudo = f_entrada.read()
                            f_saida.write(conteudo)

                        # Escreve o separador no final
                        f_saida.write(f"\n{separador}\n")
                        
                        print(f"- Código de '{caminho_relativo}' adicionado.")
                    
                    except Exception as e:
                        # Adicionado tratamento para erros de decodificação, comuns em arquivos de código
                        if isinstance(e, UnicodeDecodeError):
                            print(f"- AVISO: Não foi possível ler '{caminho_relativo}' como UTF-8. Pulando arquivo.")
                        else:
                            print(f"- ERRO: Ocorreu um erro ao processar '{caminho_relativo}': {e}")

    print(f"\nProcesso concluído! Todos os scripts foram compilados em '{arquivo_de_saida}'.")


# --- Execução Principal ---
if __name__ == "__main__":
    compilar_scripts_recursivamente()