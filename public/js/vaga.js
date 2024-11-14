document.addEventListener('DOMContentLoaded', function() {
    var quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'font': [] }],
                [{ 'size': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image']
            ]
        }
    });

    // Adicionar manipulador para "Backspace"
    quill.keyboard.addBinding({
        key: 8 // Código da tecla "Backspace"
    }, {
        collapsed: true
    }, function(range, context) {
        if (range.index > 0) {
            const [leaf, offset] = quill.getLeaf(range.index - 1);
            if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
                const imageUrl = leaf.domNode.src;
                
                // Fazer requisição ao servidor para excluir a imagem
                fetch('/delete-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageUrl: imageUrl })
                }).then(response => {
                    if (!response.ok) {
                        console.error('Erro ao excluir a imagem do servidor');
                    }
                }).catch(error => {
                    console.error('Erro na requisição de exclusão de imagem:', error);
                });

                // Remover a imagem do editor
                quill.deleteText(range.index - 1, 1);
                return false;
            }
        }
        return true;
    });

    var form = document.querySelector('form');
    form.addEventListener('submit', function() {
        var descricao = document.querySelector('input[name="descricao"]');
        descricao.value = quill.root.innerHTML;
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-button'); 
    const confirmModal = document.getElementById('confirmModal'); 
    const confirmDelete = document.getElementById('confirmDelete'); 
    const cancelDelete = document.getElementById('cancelDelete'); 

    let formToSubmit; 

    // Ao clicar em "Excluir Vaga"
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            formToSubmit = this.closest('form'); 
            confirmModal.style.display = 'block'; 
        });
    });

    // confirmar a exclusão
    confirmDelete.addEventListener('click', function() {
        confirmModal.style.display = 'none'; 
        formToSubmit.submit(); 
    });

    // cancelar a exclusão
    cancelDelete.addEventListener('click', function() {
        confirmModal.style.display = 'none'; 
        formToSubmit = null; 
    });

    // Quando clicar fora do modal, fechar o modal
    window.onclick = function(event) {
        if (event.target == confirmModal) {
            confirmModal.style.display = 'none';
        }
    };
});
