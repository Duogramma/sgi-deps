function isNumber(numero){
   var CaractereInvalido = false;

   for (i=0; i < numero.length; i++){
      var Caractere = numero.charAt(i);
      if(Caractere != "." && Caractere != "," && Caractere != "-"){
         if (isNaN(parseInt(Caractere))) CaractereInvalido = true;
      }
   }
   return !CaractereInvalido;
}