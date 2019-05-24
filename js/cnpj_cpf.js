/*
Funções
=======

function validaCNPJ(cnpj)
function validaCPF(cpf)
function validaEmail(email)

> adivinha o que estas funções fazem...


Exemplo de chamada no PHP
=========================

incluir: <script type="text/javascript" src="/guarida/js/cnpj_cpf.js"></script>

-----------------------------------
function valida_cpf()
{
 if (validaCPF( document.cadastro.cpf.value ))
  return true;
 else
  {
   alert("Inválido");
   return false;
  }  
}

-----------------------------------
function valida_cnpj()
{
 if (validaCNPJ( document.cadastro.cnpj.value ))
  return true;
 else
  {
   alert("Inválido");
   return false;
  }  
}
 */
// recebe apenas números e devolve true se for válido
function validaCNPJ(cnpj)
      {
      var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
      digitos_iguais = 1;
      if (cnpj.length < 14 && cnpj.length < 15)
			 {
               return false;
			 }  
      for (i = 0; i < cnpj.length - 1; i++)
            if (cnpj.charAt(i) != cnpj.charAt(i + 1))
                  {
                  digitos_iguais = 0;
                  break;
                  }
      if (!digitos_iguais)
            {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0,tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--)
                  {
                  soma += numeros.charAt(tamanho - i) * pos--;
                  if (pos < 2)
                        pos = 9;
                  }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
			 {
               return false;
			 }  
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--)
                  {
                  soma += numeros.charAt(tamanho - i) * pos--;
                  if (pos < 2)
                        pos = 9;
                  }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
			  {
               return false;
			  }  
            return true;
            }
      else
	    {
            return false;
		}	
      } 
 
// recebe apenas números e devolve true se for válido
function validaCPF(cpf){
       if(cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" ||
	  cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
	  cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
	  cpf == "88888888888" || cpf == "99999999999"){
	  return false;
   }

   soma = 0;
   for(i = 0; i < 9; i++)
   	 soma += parseInt(cpf.charAt(i)) * (10 - i);
   resto = 11 - (soma % 11);
   if(resto == 10 || resto == 11)
	 resto = 0;
   if(resto != parseInt(cpf.charAt(9)))
        {
		 return false;
    	}
   soma = 0;
   for(i = 0; i < 10; i ++)
	 soma += parseInt(cpf.charAt(i)) * (11 - i);
   resto = 11 - (soma % 11);
   if(resto == 10 || resto == 11)
	 resto = 0;
   if(resto != parseInt(cpf.charAt(10)))
    {
	 return false;
    }
   return true;
 }
 
 
function validaEmail(email){
var valido=0;
email = document.getElementById('cm_email').value;
if (email.length == 0)
	return true;
else	if (email.length < 5)
			return false;
		else		
			 {
			  // pesquisa por arroba
				for (i = 1; i < email.length - 1; i++)
						{
							if (email.charAt(i) == "@")
								valido = 1;
						}
				if (valido == 0)
					return false;
				else
					valido = 0;	
					
			  // pesquisa por ponto
				for (i = 1; i < email.length - 1; i++)
						{
							if (email.charAt(i) == ".")
								valido = 1;
						}
				if (valido == 0)
					return false;
				else
					return true;
			 }
}	  
	  
 
 
 
/*
Exemplo de chamada interna 
==========================

function valida_cpf()
{
 if (validaCPF( document.cadastro.cpf.value ))
  return true;
 else
  {
   alert("Inválido");
   return false;
  }  
}

function valida_cnpj()
{
 if (validaCNPJ( document.cadastro.cnpj.value ))
  return true;
 else
  {
   alert("Inválido");
   return false;
  }  
}

 
 
 */