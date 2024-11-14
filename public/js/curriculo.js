// Variaveis globais
let formacoes = [];
let experiencias =  [];
let idiomas = [{nome:"Português",nivel:'Nativo'}];
let habilidades = [];
document.addEventListener('DOMContentLoaded', function() {
    atualizarIdiomasList();
})

// Atuliza variaveis globais caso ja tenha curriculo cadastrado
function atualizarVariaveis(form, exp, idi, hab) {
    formacoes = form;
    experiencias = exp;
    if (!idi) idi = [{nome:"Português",nivel:'Nativo'}];
    idiomas = idi;
    habilidades = hab;

    atualizarFormacoesList();
    atualizarExperienciasList();
    atualizarIdiomasList();
    atualizarHabilidadesList();
}

// LIMITADOR DE CARACTER 
document.addEventListener('DOMContentLoaded', () => {
    const ddd = document.getElementById('ddd');
    const num = document.getElementById('num');
    const idade = document.getElementById('idade');
    const nome_instituicao =  document.getElementById('nome_instituicao');
    const curso =  document.getElementById('curso');
    const nome_empresa = document.getElementById('nome_empresa')
    const cargo =  document.getElementById('cargo');
    const descricao = document.getElementById('experiencia_descricao')

    ddd.addEventListener('input', () => {
        if (ddd.value.length > 2) {
            ddd.value = ddd.value.slice(0, 2);
        }
    });

    num.addEventListener('input', () => {
        if (num.value.length > 9) {
            num.value = num.value.slice(0, 9);
        }
    });

    idade.addEventListener('input', () => {
        if (idade.value.length > 2) {
            idade.value = idade.value.slice(0, 2);
        }
    });

    nome_instituicao.addEventListener('input', () => {
        if(nome_instituicao.value.length >  50) {
            nome_instituicao.value = nome_instituicao.value.slice(0, 50)
        }
    })
    curso.addEventListener('input', () => {
        if(curso.value.length >  40) {
            curso.value = curso.value.slice(0, 40)
        }
    })

    nome_empresa.addEventListener('input', () => {
        if(nome_empresa.value.length >  50) {
            nome_empresa.value = nome_empresa.value.slice(0, 50)
        }
    })

    cargo.addEventListener('input', () => {
        if(cargo.value.length >  50) {
            cargo.value = cargo.value.slice(0, 50)
        }
    })

    descricao.addEventListener('input', () => {
        if(descricao.value.length >  90) {
            descricao.value = descricao.value.slice(0, 90)
        }
    })
});

// SHOW-HIDE DEFICIENCIAS
function ShowDeficiency(){
    const show = document.getElementById('deficiency');
    show.classList.toggle('hidden');
}

// SHOW-HIDDE E INCLUIR
function hidedata(){
    const select = document.getElementById('formacao_status').value
    const data = document.getElementById('hidedata')
    const txt = document.getElementById('label_data_conclusao')

    if (select === '2'){
        txt.textContent+=' Prevista'
    }else{
        txt.textContent = txt.textContent.replace(' Prevista', '');
    }
    if (select === '3'){
        data.classList.add('hidden')

    }else{
        data.classList.remove('hidden')
    };
}
function disnabledata(){
    const checkbox = document.getElementById('experiencia_data_atual');
    const data = document.getElementById('experiencia_data_termino');

    if (checkbox.checked) {
        data.disabled = true;
    } else {
        data.disabled = false;
    }
}
function addformacao(event){
    event.preventDefault();
    const show = document.getElementById('bloco_corpo_formacao');
    show.classList.toggle('hidden');
    const x = document.getElementById('bloco_cabeca_formacao');
    x.classList.toggle('bloco_add_cabeca');
    const y = document.getElementById('incluir_formacao');
    y.classList.toggle('addnovo')
    y.classList.toggle('addnovo1')
}
function addexperiencia(event){
    event.preventDefault();
    const show = document.getElementById('bloco_corpo_experiencia');
    show.classList.toggle('hidden');
    const x = document.getElementById('bloco_cabeca_experiencia');
    x.classList.toggle('bloco_add_cabeca');
    const y = document.getElementById('incluir_experiencia');
    y.classList.toggle('addnovo')
    y.classList.toggle('addnovo1')
}
function addidioma(event){
    event.preventDefault();
    const show = document.getElementById('bloco_corpo_idioma');
    show.classList.toggle('hidden');
    const x = document.getElementById('bloco_cabeca_idioma');
    x.classList.toggle('bloco_add_cabeca');
    const y = document.getElementById('incluir_idioma');
    y.classList.toggle('addnovo')
    y.classList.toggle('addnovo1')
}


// ADICIONAR FORMAÇÃO
function adicionarFormacao() {
    const nomeInstituicao = document.getElementById('nome_instituicao').value;
    const nivel = document.getElementById('formacao_nivel').value;
    const curso = document.getElementById('curso').value;
    const dataInicio = document.getElementById('formacao_data_inicio').value;
    const dataTermino = document.getElementById('formacao_data_termino').value;
    const status = document.getElementById('formacao_status').value;

    const erromsg_data = document.getElementById('erro_preencimento_data_inicio');
    const fail_data = document.getElementById('formacao_data_inicio');
    fail_data.classList.remove('fail');
    const erroMessages_data = erromsg_data.getElementsByClassName('erro_preencimento');
    if (erroMessages_data.length > 0) {
        erromsg_data.removeChild(erroMessages_data[0]);
    }

    let isValid = true;

    if (!nomeInstituicao) {
        const fail = document.getElementById('nome_instituicao');
        fail.classList.add('fail');
    
        const erromsg = document.getElementById('erro_preencimento_instituicao');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('nome_instituicao').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_instituicao');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!nivel) {
        const fail = document.getElementById('formacao_nivel');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_nivel');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('formacao_nivel').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_nivel');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!curso) {
        const fail = document.getElementById('curso');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_curso');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('curso').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_curso');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!dataInicio) {
        const fail = document.getElementById('formacao_data_inicio');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_data_inicio');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('formacao_data_inicio').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_data_inicio');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!(status === '3') && !dataTermino){
        const fail = document.getElementById('formacao_data_termino');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_data_termino');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } 
    else {
        document.getElementById('formacao_data_termino').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_data_termino');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
        const dataAtual = new Date()
        if (status === '2' && (dataTermino < dataAtual)){
            const fail = document.getElementById('formacao_data_termino');
            fail.classList.add('fail');
            const erromsg = document.getElementById('erro_preencimento_data_termino');
            if (!erromsg.querySelector('.erro_preencimento')) {
                const msg = document.createElement('div');
                msg.className = 'erro_preencimento';
                msg.textContent = '* Data de conclusão prevista não pode ser menor que a data atual!';
                erromsg.appendChild(msg);
            }
            isValid = false;
            } 
        else {
            document.getElementById('formacao_data_termino').classList.remove('fail');
            const erromsg = document.getElementById('erro_preencimento_data_termino');
            const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
            if (erroMessages.length > 0) {
                erromsg.removeChild(erroMessages[0]);
            }
        }
    }
    
    if (isValid) {
        const select = document.getElementById('formacao_nivel');
        const option = select.options[select.selectedIndex];
        const nivel_txt = option.text;

        // Criar objeto formaçao
        const formacao = {
            instituicao: nomeInstituicao,
            nivel: nivel_txt,
            curso: curso,
            dataInicio: dataInicio,
            status: status,
            dataTermino: status === '3' ? null : dataTermino
            };
            // Adicionar a lista de formaçaos (pode ser um array global ou na sessão)
            formacoes.push(formacao);
            // Atualizar a interface para mostrar a nova formaçao na `addList`
            atualizarFormacoesList();
        // Limpar os campos após adicionar a formação
        cancelar_for()
        
    }else{
        alert('Por favor, preencha todos os campos obrigatórios, em vermelho.');
        const dataAtual = new Date()
        const dataInicio1 = new Date(document.getElementById('formacao_data_inicio').value);
        if (dataInicio1>dataAtual){
            const erromsg = document.getElementById('erro_preencimento_data_inicio');
                const fail = document.getElementById('formacao_data_inicio');
                fail.classList.add('fail');
                if (!erromsg.querySelector('.erro_preencimento')) {
                    const msg = document.createElement('div');
                    msg.className = 'erro_preencimento';
                    msg.textContent = '* Data de inicio não pode ser maior que a data atual';
                    erromsg.appendChild(msg);
                }
                isValid = false;
            }
        else {
            isValid = true;
        }

        if((status==='1'||status==='2') && dataTermino!=''){
            if (dataInicio>dataTermino){
                const erromsg = document.getElementById('erro_preencimento_data_inicio');
                const fail = document.getElementById('formacao_data_inicio');
                fail.classList.add('fail');
                if (!erromsg.querySelector('.erro_preencimento')) {
                    const msg = document.createElement('div');
                    msg.className = 'erro_preencimento';
                    msg.textContent = '* Data de inicio não pode ser maior que data de conclusão';
                    erromsg.appendChild(msg);
                }
                isValid = false;
            }
            else {
                // Atualiza isValid apenas se a condição original for atendida
                isValid = true;
            }
        }
    }
}
function atualizarFormacoesList() {
    const formacoesList = document.getElementById('formacaoesList');
    formacoesList.innerHTML = ''; // limpa a lista de divs

    formacoes.forEach((form, index) => {
    const formacaoItem = document.createElement('div');
    formacaoItem.className = 'add_item_list';

    let dataTerminoText;
    if (form.status === '2') {
        dataTerminoText = '- Atualidade';
    } else {
        if (form.status === '3') {
            dataTerminoText = '- Trancado';
            document.getElementById('formacao_data_termino').value = '';
        } else {
            dataTerminoText = `até ${formatarData(form.dataTermino)}`;
        }
    }
  
    const dataInicioFormatada = formatarData(form.dataInicio); // Formatar data de início
  
    const removeButton = document.createElement('button');
    removeButton.type = "button";
    removeButton.className = 'remove-button';
    removeButton.textContent = 'X';
    removeButton.onclick = function() {
        // Remover o item da lista quando o botão de exclusão é clicado
        formacoesList.removeChild(formacaoItem);
        formacoes.splice(index, 1); // Remover o item do array
    };
    formacaoItem.innerHTML = `
        <div data-index="${index}">
          <strong>${form.curso}</strong>, ${form.nivel} -- de ${dataInicioFormatada} ${dataTerminoText}
        </div>
    `;
  
        formacaoItem.appendChild(removeButton);
        formacoesList.appendChild(formacaoItem);
    });
}


// ADICIONAR EXPERIENCIA
function adicionarExperiencia() {
    const nomeEmpresa = document.getElementById('nome_empresa').value;
    const cargo = document.getElementById('cargo').value;
    const hierarquia = document.getElementById('hierarquia').value;
    const dataInicio = document.getElementById('experiencia_data_inicio').value;
    const dataTermino = document.getElementById('experiencia_data_termino').value;
    const descricao = document.getElementById('experiencia_descricao').value;
    const atualmente = document.getElementById('experiencia_data_atual').checked;


    // Verificar campos obrigatórios e adicionar classe 'fail' se necessário
    const erromsg_data = document.getElementById('erro_preencimento_experiencia_data_inicio');
    const fail_data = document.getElementById('experiencia_data_inicio');
    fail_data.classList.remove('fail');
    const erroMessages_data = erromsg_data.getElementsByClassName('erro_preencimento');
    if (erroMessages_data.length > 0) {
        erromsg_data.removeChild(erroMessages_data[0]);
    }
    let isValid = true;

    if (!nomeEmpresa) {
        const fail = document.getElementById('nome_empresa');
        fail.classList.add('fail');
    
        const erromsg = document.getElementById('erro_preencimento_experiencia_empresa');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('nome_empresa').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_empresa');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!cargo) {
        const fail = document.getElementById('cargo');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_cargo');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('cargo').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_cargo');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!hierarquia) {
        const fail = document.getElementById('hierarquia');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_hierarquia');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('cargo').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_cargo');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!dataInicio) {
        const fail = document.getElementById('experiencia_data_inicio');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_data_inicio');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('experiencia_data_inicio').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_data_inicio');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }
    if (!dataTermino && !atualmente) {
        const fail = document.getElementById('experiencia_data_termino');
        fail.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_data_termino');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        document.getElementById('experiencia_data_termino').classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_experiencia_data_termino');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }

    if (isValid) {
        const select = document.getElementById('hierarquia');
        const option = select.options[select.selectedIndex];
        const nivel_txt = option.text;

        // Criar objeto experiência
        const experiencia = {
        empresa: nomeEmpresa,
        cargo: cargo,
        nivel: nivel_txt,
        dataInicio: dataInicio,
        dataTermino: atualmente ? null : dataTermino,
        descricao: descricao
        };
        // Adicionar a lista de experiências (pode ser um array global ou na sessão)
        experiencias.push(experiencia);
        // Atualizar a interface para mostrar a nova experiência na `addList`
        atualizarExperienciasList();

        // Limpar os campos após adicionar a experiência
        cancelar_exp()

    }else{
        alert('Por favor, preencha todos os campos obrigatórios, em vermelho.');
        const dataAtual = new Date()
        const dataInicio1 = new Date(document.getElementById('experiencia_data_inicio').value);
        if (dataInicio1>dataAtual){
            const erromsg = document.getElementById('erro_preencimento_experiencia_data_inicio');
                const fail = document.getElementById('experiencia_data_inicio');
                fail.classList.add('fail');
                if (!erromsg.querySelector('.erro_preencimento')) {
                    const msg = document.createElement('div');
                    msg.className = 'erro_preencimento';
                    msg.textContent = '* Data de inicio não pode ser maior que a data atual';
                    erromsg.appendChild(msg);
                }
                isValid = false;
            }
        else {
            isValid = true;
        }
        
        if(!atualmente && dataTermino!=''){
            if (dataInicio>dataTermino){
                const erromsg = document.getElementById('erro_preencimento_experiencia_data_inicio');
                const fail = document.getElementById('experiencia_data_inicio');
                fail.classList.add('fail');
                if (!erromsg.querySelector('.erro_preencimento')) {
                    const msg = document.createElement('div');
                    msg.className = 'erro_preencimento';
                    msg.textContent = '* Data de inicio não pode ser maior que data de conclusão';
                    erromsg.appendChild(msg);
                }
                isValid = false;
            }
            else {
                // Atualiza isValid apenas se a condição original for atendida
                isValid = true;
            }
        }
    }
}
function atualizarExperienciasList() {
    const experienciasList = document.getElementById('experienciasList');
    experienciasList.innerHTML = ''; // limpa a lista de divs
    
    experiencias.forEach((exp, index) => {
        const experienciaItem = document.createElement('div');
        experienciaItem.className = 'add_item_list';
    
        const dataInicioFormatada = formatarData(exp.dataInicio); // Formatar data de início
        const dataFimFormatada = exp.dataTermino != null ? formatarData(exp.dataTermino) : 'Atual';
        
        const removeButton = document.createElement('button');
        removeButton.type = "button";
        removeButton.className = 'remove-button';
        removeButton.textContent = 'X';
        removeButton.onclick = function() {
          // Remover o item da lista quando o botão de exclusão é clicado
          experienciasList.removeChild(experienciaItem);
          experiencias.splice(index, 1); // Remover o item do array
        };
    
        experienciaItem.innerHTML = `
        <div data-index="${index}">
            <strong>${exp.nivel}</strong> de <strong>${exp.cargo}</strong> em: ${exp.empresa} - (${dataInicioFormatada} - ${dataFimFormatada})
            <br/><p class='div90'>${exp.descricao}</p>
        </div>
        `;
    
        experienciaItem.appendChild(removeButton);
        experienciasList.appendChild(experienciaItem);
    });
}


// ADICIONAR IDIOMA
function adicionarIdioma() {
    const idiomaSelect = document.getElementById('idioma');
    const nivelSelect = document.getElementById('idioma_nivel');

    // Corrigindo o acesso ao valor e texto do idioma e nível
    const idiomaNome = idiomaSelect.options[idiomaSelect.selectedIndex].text; // Nome do idioma
    const nivelNome = nivelSelect.options[nivelSelect.selectedIndex].text;    // Nome do nível

    let isValid = true;

    // Verificação dos campos obrigatórios
    if (!idiomaNome) {
        idiomaSelect.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_idioma');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        idiomaSelect.classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_idioma');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }

    if (!nivelNome) {
        nivelSelect.classList.add('fail');
        const erromsg = document.getElementById('erro_preencimento_idioma_nivel');
        if (!erromsg.querySelector('.erro_preencimento')) {
            const msg = document.createElement('div');
            msg.className = 'erro_preencimento';
            msg.textContent = '* Campo Obrigatório';
            erromsg.appendChild(msg);
        }
        isValid = false;
    } else {
        nivelSelect.classList.remove('fail');
        const erromsg = document.getElementById('erro_preencimento_idioma_nivel');
        const erroMessages = erromsg.getElementsByClassName('erro_preencimento');
        if (erroMessages.length > 0) {
            erromsg.removeChild(erroMessages[0]);
        }
    }

    if (isValid) {
        // Criar objeto idioma com nome e nível
        const novoIdioma = {
            nome: idiomaNome, // Usando o texto do idioma
            nivel: nivelNome  // Usando o texto do nível
        };
        // Adicionar ao array de idiomas
        idiomas.push(novoIdioma);
        // Atualizar a interface
        atualizarIdiomasList();
        // Limpar os campos
        cancelar_idi()
    } else {
        alert('Por favor, preencha todos os campos obrigatórios, em vermelho.');
    }
}
// Função para atualizar a lista de idiomas no frontend
function atualizarIdiomasList() {
    const idiomasList = document.getElementById('idiomasList');
    idiomasList.innerHTML = ''; // Limpa a lista de divs
  
    idiomas.forEach((idioma, index) => {
      const idiomaItem = document.createElement('div');
      idiomaItem.className = 'add_item_list';
  
      const idiomaContent = document.createElement('div');
      idiomaContent.innerHTML = `<strong>${idioma.nome}</strong> -- <em>${idioma.nivel}</em>`;
  
      const removeButton = document.createElement('button');
      removeButton.type = "button";
      removeButton.className = 'remove-button';
      removeButton.textContent = 'X';
      removeButton.onclick = function() {
        idiomasList.removeChild(idiomaItem);
        idiomas.splice(index, 1); // Remover o item do array
      };
  
      idiomaItem.appendChild(idiomaContent);
      idiomaItem.appendChild(removeButton);
      idiomasList.appendChild(idiomaItem);
    });
}


// ADICIONAR HABILIDADES
function addHabilidades() {
    const habilidadeInput = document.getElementById('hability');
    const habilidadeNome = habilidadeInput.value.trim(); // Corrigir para acessar o valor da habilidade

    if (habilidadeNome !== '') {
        // Criar objeto habilidade com o nome
        const novaHabilidade = {
            nome: habilidadeNome
        };
        habilidades.push(novaHabilidade);
        atualizarHabilidadesList();
        habilidadeInput.value = '';
    } else {
        alert('Por favor, insira uma habilidade.');
    }
}
// Função para atualizar a lista de habilidades no frontend
function atualizarHabilidadesList() {
    const habilidadesList = document.getElementById('hability_salva');
    habilidadesList.innerHTML = ''; // Limpa a lista de divs
  
    habilidades.forEach((habilidade, index) => {
        const habilidadeItem = document.createElement('div');
        habilidadeItem.className = 'habilidade_item';
    
        const habilidadeText = document.createElement('span');
        habilidadeText.textContent = habilidade.nome; // Corrigir para acessar o nome da habilidade
    
        const removeButton = document.createElement('a');
        removeButton.className = 'delete';
        removeButton.textContent = 'X';
        removeButton.onclick = function() {
            habilidadesList.removeChild(habilidadeItem);
            habilidades.splice(index, 1); // Remover o item do array
        };
    
        habilidadeItem.appendChild(habilidadeText);
        habilidadeItem.appendChild(removeButton);
        habilidadesList.appendChild(habilidadeItem);
    });
}


// FORMATAR DATAS
function formatarData(dataISO) {
    if (!dataISO) return '';
    const [year, month, day] = dataISO.split('-');
    const data = new Date(year, month-1)
    const options = { year: 'numeric', month: 'long' };
    return data.toLocaleDateString('pt-BR', options);
}


// SERIALIZAR ARRAYS
function serializeArrays() {
    document.getElementById('formacoes-hidden').value = JSON.stringify(formacoes);
    document.getElementById('experiencias-hidden').value = JSON.stringify(experiencias);
    document.getElementById('idiomas-hidden').value = JSON.stringify(idiomas);
    document.getElementById('habilidades-hidden').value = JSON.stringify(habilidades);
}
// Chamada de serializeArrays antes de dar submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form')
    if (form) {
        form.addEventListener('submit', serializeArrays);
    }
});

// BUTTONS CANCELAR
function cancelar_for(event) {
    document.getElementById('nome_instituicao').value= '';
    document.getElementById('formacao_nivel').value= '';
    document.getElementById('curso').value= '';
    document.getElementById('formacao_data_inicio').value= '';
    document.getElementById('formacao_status').value= '1';
    document.getElementById('formacao_data_termino').value= '';
    const data = document.getElementById('hidedata')
    data.classList.remove('hidden')

    addformacao(event)
}
function cancelar_exp(event) {
    document.getElementById('nome_empresa').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('experiencia_data_inicio').value = '';
    document.getElementById('experiencia_data_termino').value = '';
    document.getElementById('experiencia_data_atual').checked = false;
    document.getElementById('experiencia_descricao').value = '';
    const data = document.getElementById('experiencia_data_termino');
    data.disabled = false;

    addexperiencia(event)
}
function cancelar_idi(event) {
    document.getElementById('idioma').value = '';
    document.getElementById('idioma_nivel').value = '';

    addidioma(event)
}




function SalvarCurriculo(event){
    event.preventDefault();

    
}