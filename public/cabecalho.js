function cabecalho(){
    document.querySelector('#aba-ficha').addEventListener('click', e=>{
        window.location.href = "./index.html";
    });
    document.querySelector('#aba-filiado').addEventListener('click', e=>{
        window.location.href = "./filiado.html";
    });
    document.querySelector('#aba-contribuicao').addEventListener('click', e=>{
        window.location.href = "./contribuicao.html";
    });
}