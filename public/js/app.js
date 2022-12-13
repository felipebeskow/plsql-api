class App{
    constructor(){
        this.bodyApp = document.querySelector('#app');
        this.bodyApp.innerHTML = `
            <h1>Terapia</h1>
            <br>
            <button id="aba-ficha">Fichas</button>
            <button id="aba-filiados">Filiados</button>
            <button id="aba-contribuicao">Contribuição</button>
            <br><br><br>
        `;
    }
}