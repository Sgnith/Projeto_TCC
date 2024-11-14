module.exports = {
    validaCNPJ: function validaCNPJ (cnpj){
        cnpj = cnpj.replace(/[^\d]+/g,'')

        if (cnpj.length!==14){
            return false
        }
        
        function calcular(cnpj,pesos){
            let soma=0
            for (let i=0;i<pesos.length;i++){
                soma += cnpj[i]*pesos[i]
            }
            let resto = soma%11
            return resto<2 ? 0: 11-resto
        }

    }
}