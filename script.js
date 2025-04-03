
        async function buscarDados() {
            const numRegistros = document.getElementById('numRegistros').value;
            const resposta = await fetch(`http://localhost:3000/sensor?limit=${numRegistros}`);
            const dados = await resposta.json();
            atualizarTabela(dados);
            atualizarGrafico(dados);
        }

        function atualizarTabela(dados) {
            const tabela = document.getElementById('tabela-dados');
            tabela.innerHTML = '';
            dados.forEach(dado => {
                const row = `<tr><td>${dado.distance}</td><td>${new Date(dado.timestamp).toLocaleString()}</td></tr>`;
                tabela.innerHTML += row;
            });
        }
        
        function atualizarGrafico(dados) {
            const ctx = document.getElementById('grafico').getContext('2d');
            const labels = dados.map(d => new Date(d.timestamp).toLocaleTimeString());
            const valores = dados.map(d => d.distance);
            
            if (window.meuGrafico) window.meuGrafico.destroy();
            window.meuGrafico = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Distância(cm)',
                        data: valores,
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: { responsive: true }
            });
        }

        buscarDados();
