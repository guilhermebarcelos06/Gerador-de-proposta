 const generateBtn = document.getElementById('generateBtn');
        const loader = document.getElementById('loader');
        const btnText = document.getElementById('btn-text');
        const userInfoInput = document.getElementById('userInfo');
        const projectDescInput = document.getElementById('projectDesc');
        const keySkillsInput = document.getElementById('keySkills');
        const proposalToneSelect = document.getElementById('proposalTone');
        const generatedProposalTextarea = document.getElementById('generatedProposal');
        const copyBtn = document.getElementById('copyBtn');
        const messageBox = document.getElementById('messageBox');

        // Função para mostrar e esconder o loader
        const setLoading = (isLoading) => {
            if (isLoading) {
                btnText.classList.add('hidden');
                loader.classList.remove('hidden');
                generateBtn.disabled = true;
            } else {
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
                generateBtn.disabled = false;
            }
        };
        
        // Função para mostrar a mensagem de cópia
        const showCopyMessage = () => {
            messageBox.classList.remove('hidden');
            setTimeout(() => messageBox.classList.remove('opacity-0'), 10); // Fade in
            setTimeout(() => {
                messageBox.classList.add('opacity-0');
                 setTimeout(() => messageBox.classList.add('hidden'), 300);
            }, 2000); // Fade out and hide after 2 seconds
        };

        // Event listener para o botão de gerar
        generateBtn.addEventListener('click', async () => {
            const userInfo = userInfoInput.value.trim();
            const projectDesc = projectDescInput.value.trim();
            const keySkills = keySkillsInput.value.trim();
            const proposalTone = proposalToneSelect.value;

            if (!userInfo || !projectDesc) {
                generatedProposalTextarea.value = "ERRO: Por favor, preencha suas informações e a descrição do projeto antes de continuar.";
                return;
            }
            
            setLoading(true);
            generatedProposalTextarea.value = "Analisando o projeto e redigindo uma proposta única... Por favor, aguarde.";

            try {
                // Prompt detalhado para a API do Gemini
                const prompt = `
                    **Tarefa:** Atue como um freelancer sênior, especialista em desenvolvimento web e estratégia digital. Sua missão é redigir uma proposta comercial concisa e de alto impacto para um projeto de criação de site.

                    **Persona:** Adote um tom **${proposalTone}**. Você é confiante, competente e focado em resolver o problema do cliente.

                    **Contexto do Pedido:**
                    - **Minhas Informações (Freelancer):** ${userInfo}
                    - **Descrição do Projeto do Cliente:** ${projectDesc}
                    - **Habilidades Chave a Destacar (se houver):** ${keySkills || 'Nenhuma habilidade específica a destacar, foque nos pontos principais do projeto.'}

                    **Estrutura Obrigatória da Proposta (use os títulos em negrito):**

                    **Assunto:** Proposta para o Projeto de Desenvolvimento Web

                    **Olá, [se possível, use o nome do cliente, senão, use uma saudação genérica]!**

                    Li com atenção a descrição do seu projeto e compreendi que o seu objetivo principal é [resuma o objetivo central do cliente em uma frase, mostrando que você entendeu a necessidade].

                    **Minha Abordagem para o Seu Projeto**
                    Com base na minha experiência, sugiro uma abordagem focada em [mencione 1 ou 2 pilares, como 'design focado na conversão e performance otimizada']. Para isso, pretendo utilizar tecnologias como [sugira tecnologias relevantes, ex: React/Next.js para dinamismo, ou WordPress para fácil gerenciamento de conteúdo], garantindo que o resultado final seja moderno, seguro e alinhado com suas metas.
                    ${keySkills ? `Destaco minha experiência em **${keySkills}**, que será fundamental para [explique como essas habilidades resolvem um problema específico do projeto].` : ''}

                    **Próximos Passos e Esclarecimentos**
                    Para que possamos avançar com uma proposta de valor e prazo mais precisa, gostaria de esclarecer alguns pontos:
                    - [Faça uma pergunta inteligente sobre o público-alvo, ex: Qual é o principal perfil de usuário que o site deve atrair?]
                    - [Faça uma pergunta inteligente sobre funcionalidades, ex: Existe alguma funcionalidade específica que é indispensável para o lançamento inicial?]

                    **Vamos Conversar?**
                    Acredito que meu perfil e experiência se encaixam perfeitamente no que você procura. Gostaria de agendar um breve bate-papo de 15 minutos para discutirmos mais a fundo e alinharmos as expectativas.

                    Atenciosamente,

                    [Seu Nome, conforme as informações fornecidas]
                `;

                // Chamar a API do Gemini (exemplo de como seria a chamada)
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = "AIzaSyBIi1fm0sCzjIg-wvPNnX-WcgALYKmNhEQ"; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    generatedProposalTextarea.value = text;
                } else {
                    throw new Error("A resposta da API não contém o texto esperado ou possui uma estrutura inválida.");
                }

            } catch (error) {
                console.error("Erro ao gerar proposta:", error);
                generatedProposalTextarea.value = `Ocorreu um erro ao conectar com a IA. Por favor, tente novamente.\n\nDetalhes do erro: ${error.message}`;
            } finally {
                setLoading(false);
            }
        });

        // Event listener para o botão de copiar
        copyBtn.addEventListener('click', () => {
            if(!generatedProposalTextarea.value || generatedProposalTextarea.value.startsWith("Analisando") || generatedProposalTextarea.value.startsWith("ERRO")){
                return;
            }
            generatedProposalTextarea.select();
            document.execCommand('copy');
            showCopyMessage();
        });