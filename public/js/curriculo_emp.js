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


// SHOW-HIDE DEFICIENCIAS
function ShowDeficiency(){
    const show = document.getElementById('deficiency');
    show.classList.toggle('hidden');
}


// ADICIONAR FORMAÇÃO
function atualizarFormacoesList() {
    const formacoesList = document.getElementById('formacaoesList');
    formacoesList.innerHTML = ''; // limpa a lista de divs

    formacoes.forEach((form, index) => {
        const formacaoItem = document.createElement('div');
        formacaoItem.className = 'add_item_list';

        let dataTerminoText;
        if (form.status === 2) {
            dataTerminoText = '-- Atualidade';
        } else {
            if (form.status === 3) {
                dataTerminoText = '-- Trancado';
                document.getElementById('formacao_data_termino').value = '';
            } else {
                dataTerminoText = `até: ${formatarData(form.dataTermino)}`;
            }
        }
    
        const dataInicioFormatada = formatarData(form.dataInicio); // Formatar data de início
    
        formacaoItem.innerHTML = `
            <div data-index="${index}">
                <strong>${form.curso}</strong>, ${form.instituicao}, ${form.nivel} <br>
                de: ${dataInicioFormatada} ${dataTerminoText}
            </div>
        `;
  
        formacoesList.appendChild(formacaoItem);
    });
}
// ADICIONAR EXPERIENCIA
function atualizarExperienciasList() {
    const experienciasList = document.getElementById('experienciasList');
    experienciasList.innerHTML = ''; // limpa a lista de divs
    
    experiencias.forEach((exp, index) => {
        const experienciaItem = document.createElement('div');
        experienciaItem.className = 'add_item_list';
    
        const dataInicioFormatada = formatarData(exp.dataInicio); // Formatar data de início
        const dataFimFormatada = exp.dataTermino != null ? formatarData(exp.dataTermino) : 'Atualidade';
        
    
        experienciaItem.innerHTML = `
        <div data-index="${index}">
            <strong>${exp.cargo}, ${exp.nivel}</strong> em: ${exp.empresa} <br>
            ${dataInicioFormatada} - ${dataFimFormatada}<br/>
            <p class='div90'>${exp.descricao}</p>
        </div>
        `;
    
        experienciasList.appendChild(experienciaItem);
    });
}
// ADICIONAR IDIOMA
function atualizarIdiomasList() {
    const idiomasList = document.getElementById('idiomasList');
    idiomasList.innerHTML = ''; // Limpa a lista de divs
  
    idiomas.forEach((idioma, index) => {
      const idiomaItem = document.createElement('div');
      idiomaItem.className = 'add_item_list';
  
      const idiomaContent = document.createElement('div');
      idiomaContent.innerHTML = `<strong>${idioma.nome}</strong> -- <em>${idioma.nivel}</em>`;
  
  
      idiomaItem.appendChild(idiomaContent);
      idiomasList.appendChild(idiomaItem);
    });
}
// ADICIONAR HABILIDADES
function atualizarHabilidadesList() {
    const habilidadesList = document.getElementById('hability_salva');
    habilidadesList.innerHTML = ''; // Limpa a lista de divs
  
    habilidades.forEach((habilidade, index) => {
        const habilidadeItem = document.createElement('div');
        habilidadeItem.className = 'habilidade_item';
    
        const habilidadeText = document.createElement('span');
        habilidadeText.textContent = habilidade.nome; 
    
    
        habilidadeItem.appendChild(habilidadeText);
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



