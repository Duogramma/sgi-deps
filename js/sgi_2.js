(function(window){

/*
*Biblioteca responsvel por agilizar rotinas javascript,
*no desenvolvimento do SGI - Sistema  de Gerencimento Integrado  da Guarida Imveis
*@name SGI
*@author Robisson Cardoso de Oliveira
*@date 25/02/2010 18:05
*@version 1.0.0
*/
	var S = SGI = G = Guarida = {
		/*
		*Retona o objeto html capturado pelo id
		*@param id string 
		*@return 
		*/
		id:function(id){
			return document.getElementById(id);	
		},
		/*
		*Retona um array de objetos html capturado pelo name
		*@param tag string 
		*@return 
		*/
		tagName:function(tag){
			return document.getElementsByTagName(tag);	
		},
		/*
		*Retona um array de objetos html capturado pela tag
		*@param name string 
		*@return 
		*/
		byName:function(name){
			return document.getElementsByName(name);
		},
		/*
		*Retona um array de objetos html capturado pela classe css
		*@param class string 
		*@return 
		*/
		className:function(classe,node,tag){

			if(document.getElementsByClassName){
			
				return document.getElementsByClassName(classe);
				
			}
			else{
				
				var classElements = new Array();
				if ( node == null )
					node = document;
				if ( tag == null )
					tag = '*';
				
				var els = node.getElementsByTagName(tag);
				var elsLen = els.length;
				var pattern = new RegExp("(^|\\s)"+classe+"(\\s|$)");
				for (i = 0, j = 0; i < elsLen; i++) {
					if ( pattern.test(els[i].className) ) {
						classElements[j] = els[i];
						j++;
					}
				}
				
				return classElements;
			}
		},
		/*
		*Retorna uma referncia para o proximo elemento
		*ou retorna nulo
		*/
		prev : function( elem ) {
			do {
				elem = elem.previousSibling;
			} while ( elem && elem.nodeType != 1 );
			
			return elem;
		},
		/*
		*Funo para log do firebug
		*/
		log:function(dado)
		{
			return console.log(dado);	
		},
		/*
		*Serializa dados em formato json
		*@param rs string
		*@return Object JSON
		*/
		json:function(rs)
		{
			return eval('(' + rs + ')');
		},
		/*
		*Realiza requisies ajax
		*
		*@var url endereo http da requisio
		*@var method GET ou POST, default e GET
		*@var param dados que se deseja enviar para o servidor
		*@var carrregando function chamada no inicio da requisicao
		*@var sucesso function chamada no final da requisio ajax e tra um parametro que  a resposta do servidor
		*/
		ajax:function(options)
		{
			/**
			*	funo que formata os parametros que sero enviadas para a pagina destino
			*	@param param Object 
			*	@return String url formatada
			*/
			var formataDados = function(param)
			{
				var queryString ='';
				for(var pro in param)
				{
					queryString += pro +'='+ param[pro]+ '&';
				}
				queryString = queryString.substring(0,queryString.length - 1 );
				return queryString;
			}
			
			//setando valores default
			var url = options.url != null ? options.url : SGI.alert("No foi definida a url destino"), 
			method = options.method ||'GET', 
			urlParametros = options.param != null ? formataDados(options.param) : '',
			carregando = options.carregando || function(http){},
			sucesso = options.sucesso || function(rs,http){},
			erro = options.erro || function(http){},
			contentType = options.header || "application/x-www-form-urlencoded";
				
			var objHttp = function()
			{								//Instanciando objeto XMLHttpRequest nos diversos navedaores
				try{
					var http = new XMLHttpRequest();	
				}catch(erro)
				{
					try{
						http = new ActiveXObject("Msxml.XMLHTTP");	
					}catch(erro2)
					{
						try{
							http = new ActiveXObject("Microsoft.XMLHTTP");						
						}catch(erro3)
						{
							http = false;
						}
					}
				}
				return http;
			}
			//funcao que inicia todo o processo ajax		
			var iniciaRequisicao = function()
			{		
					var http = objHttp(); 
					http.open(method,url +(method == 'GET' ? '?'+ urlParametros: '' ),true); //se o metodo  get coloca os
																							//parametros aqui
					var Chrome = window.navigator.userAgent.search( new RegExp("Chrome","g") );  
					if(Chrome != -1){//testa se for o chrome inicia o preloader antes															
						carregando(http);
					}
					
					http.onreadystatechange = function ()									
					{																		
						if(http.readyState == 4)//se a requisicao ja terminou 
						{
							if(http.status == 200){ // em caso de sucesso
								sucesso(http.responseText, http);
							}
							else{ //se a requisicao falhar
								erro(http);		
							}
						}
						else //enquanto ainda esta caregando
						{
							carregando(http);
						}
					};
					if(method == 'POST') //se for post precisa setar o content-type de formulario
					{
						http.setRequestHeader("Content-Type", contentType);	
					}
					http.send((method == 'POST' ? urlParametros : null ));
			}
			
			iniciaRequisicao();
		},
		pegaUltimoZIndex:function(){
			
		    var retornaMaior = function(v1, v2){
			return v1 > v2 ? v1 : v2;    
		    }
		   
		   var zIndex = 0;
		   var els = document.body.getElementsByTagName('*');
		   
		   for(var i = 0; i < els.length ; i++)
			if(els[i].style.zIndex != '')
			   zIndex = retornaMaior(zIndex, parseInt(els[i].style.zIndex,10));
		
		   return zIndex + 1;
           
		},
		alert:function(options)
		{
                        var IE = (window.navigator.userAgent.search('MSIE') != -1);
			var titulo = options.titulo || 'Alerta';
			var confirm = options.confirm || false;
			var template = '<div class="boxAlertSGI"></div><div class="sgiAlert"><h5></h5><div class="sgiAlertConteudo"><p></p></div><div  class="sgiAlertBtnOk"><input type="button" style="display:none" value="Cancelar"/>&nbsp;<input type="button" value="OK"/></div></div>';
			var div = document.createElement('div');
			div.innerHTML = template;
			
			var box = div.childNodes[0];
			var divSGIAlert = div.childNodes[1];
			var divBotoesAlert = divSGIAlert.childNodes[2];
			var btnAlertCancelar = divBotoesAlert.childNodes[0];
			var btnAlertOk = divBotoesAlert.childNodes[2];
			
			box.style.zIndex = SGI.pegaUltimoZIndex();
			divSGIAlert.style.zIndex = SGI.pegaUltimoZIndex();
			document.body.appendChild(div);
			
			//btnAlertOK
			btnAlertOk.focus();

                        //h5 titulo
			divSGIAlert.childNodes[0].innerHTML = titulo;
			
			//p conteudo
			divSGIAlert.childNodes[1].childNodes[0].innerHTML = typeof options == 'object' ? options.conteudo : options;
			
			//centralizando o alert
		        var vertical = IE ? (window.screen.availHeight/ 2) - (divSGIAlert.offsetHeight / 2) :
			                       (window.innerHeight/ 2) - (divSGIAlert.offsetHeight / 2);
					       
			var horizontal = IE ? (document.body.offsetWidth/ 2) - (divSGIAlert.offsetWidth / 2) :
			                  (window.innerWidth/ 2) - (divSGIAlert.offsetWidth / 2);
			   
                        divSGIAlert.style.top = vertical + 'px';
                        divSGIAlert.style.left = horizontal + 'px';

                        var altura = (IE) ? document.body.offsetHeight : window.innerHeight ;
			box.style.height = altura +'px';
			
			/**
			*    Se for do tipo caixa confirm 
			*/
			if(confirm){   
			
				btnAlertCancelar.style.display = '';
				btnAlertCancelar.focus();
				btnAlertCancelar.onclick = function(){
					document.body.removeChild(div);	
				}
				
			}
				
			btnAlertOk.onclick = function(){
				
				document.body.removeChild(div);
				
				if(options.confirmFunction != null)
				        options.confirmFunction();
			}
			
                        
		},
		
		/*EPSPAO PARA PERSONALIZAR
		*
		*Ex.: 	
		*   nomeDaMinhaFuncao : function(params){
		*   	//codigo funco
		*	}
		*
		*	Usando personalizao       ------>       SGI.nomeDaMinhaFuncao();
		*
		*/
		
		importar:function(url){
			
			
			var script = document.createElement("script");
			var args = arguments;
			script.type = "text/javascript";
		
			if (script.readyState){  //IE
				script.onreadystatechange = function(){
					if (script.readyState == "loaded" ||
							script.readyState == "complete"){
						script.onreadystatechange = null;
						
						if(args.length > 1)
						    args[1]();
					}
				};
			} else {  //Outros browsers
				script.onload = function(){
					if(args.length > 1)
						args[1]();
				};
			}
		
			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
						
				
		},
		init:function(){
			
			if(typeof $ == 'undefined')
				SGI.importar(
				      '/guarida/js/jquery/jquery-1.4-0.min.js',
				      function(){
					  //iniciar painel de controle    
					  SGI.carregarPainelControle()
					  
					  //carregar codigo autocomplete para futuros usos
					  
				          
				      }
				 );
			else
				SGI.carregarPainelControle();		
				
					
		},
		carregarPainelControle:function(){
	                
			SGI.importar(
			      '/guarida/programas/ti/painel_controle/js/PainelControle.js',
			      function(){
				      
				   SGI.PainelControle.init()
				   
				   //carregar auto complete para usar mais tarde
				   var url = "/guarida/js/jquery/jquery-autocomplete/jquery.autocomplete.css";
				   $('<link rel="stylesheet" type="text/css" href="'+ url +'" >').appendTo("head");
				   
				    SGI.importar('/guarida/js/jquery/jquery-autocomplete/jquery.autocomplete.js');
				    
			      }
			);
					
    			$.ajax({
			    url:'/guarida/programas/ti/painel_controle/operacoes/painel_controle/index.php',
			    success:function(rs){
				    
				    $('body').append(rs);	
			    }
			});
		
		}
		
	};
	

	
})(window);
	
(function(window){
		  
/*
*	Classe responsavel por mostrar as mensagens do sistema
*	@author Robisson Cardoso de Oliveira	
*	@date 30/04/2010
*
*	@CODE estrutura para funcionamento
*	
*	HTML...
*	<div id="sgi_mensagem"></div>
*
*	Javascript...
*	new MSG('mensagem','tipo_mensagem', 'erro_do_compilador');
*
*	@param mesg String mensagem a ser mostrada
*	@oaram type String tipo de mensagem, que o nome da classe CSS ( sucesso | alerta | erro )
*	@param time Integer tempo que a mensagem deve ficar em exibicao em mililsegundos, se null, a mensagem nao some
*	@return void
*/
	var MSG = window.MSG = function(mesg, type,time, msgErro){
	
	//referencia do container de mensagens
	var sgiMensagem = document.getElementById('sgi_mensagem');
	
	//removendo mensagens que ja estao na tla
	if(typeof mesg == 'object'){
		sgiMensagem.removeChild(mesg);
		return true;
	}
	
	//criando a div container de cada mensagen
	var divPai = document.createElement('div');
		
	var divConteudo = document.createElement('div');
	divConteudo.className = type;//definindo o tipo de mensagem
	divConteudo.innerHTML = "<p class='erroMensagem'>"+mesg+"</p>"; //pegando o primeiro p da div e colocando a mensagem nele
	
	//CODIGO DEBUG
	if(type == 'erro' && ( arguments.length > 2) ){ /*se for do tipo erro vai mostrar so detalhes do erro, e 
													tiver uma mensagem adcional a ser mostrada */ 
		if(typeof time !== 'number' || (msgErro != null)){ //se o time for string entao, a mensagem de erro e o 3 argumento
		
			mensagemErro = (typeof time !== 'number') ? time : msgErro; //se time nao for numero entao o 3 argumento e a msgErro  
			//Criando estrutura do debug
			var msgDebug = document.createElement('div');
			msgDebug.className = 'debug_close';
			
			var btnDetalhes = document.createElement('a');
			btnDetalhes.id = 'msg_detalhes';
			btnDetalhes.href = 'javascript:void(0)';
			btnDetalhes.innerHTML = '+ Detalhes';
			msgDebug.appendChild(btnDetalhes);
			
			var pmsgErro = document.createElement('p');
			pmsgErro.style.display = 'none';
			msgDebug.appendChild(pmsgErro);
			
			/*
			*	Funcao responsavel por  mostrar ou ocultar o debug das mensagens de erro
			*/
			btnDetalhes.onclick = function(){
				
				if(pmsgErro.style.display == 'none'){
					pmsgErro.style.display = 'block';
					this.innerHTML = '- Fechar detalhes';
					msgDebug.className = 'debug_open';
					
				}else{
					
					pmsgErro.style.display = 'none';
					this.innerHTML = '+ detalhes';
					msgDebug.className = 'debug_close';
					
				}	
				
				return false;
			} ;
			
			//setando mensagem de erro extra do sistema
			pmsgErro.innerHTML = 'Erro no arquivo <span style=\"color:#000000\">' + mensagemErro.arquivo + '</span> na linha <span style=\"color:#000000\">' + mensagemErro.linha + '</span><br/>Descri&ccedil;&atilde;o: <span style=\"color:#000000\">' + mensagemErro.mensagem + '</span>';
			
			
			divConteudo.appendChild(msgDebug);
		}
			
	}//FIM CODIGO DEBUG		
	
	divPai.appendChild(divConteudo);
	sgiMensagem.appendChild(divPai);
	
	if(time != null && (typeof time === 'number')){	//caso seja setado o time, inica o contador para que a mensagem suma
		setTimeout(function(){
					 sgiMensagem.removeChild(divPai);
				   },time);	
	}
	
	return divPai;

}

})(window);

(function(window){

/**
*	Classe responsavel por criar o efeitos de abas na camada de apresentacao
*	@author Robisson Cardoso de Oliveira	
*	@date 03/05/2010
*	@CODE estrutura de uso
*	
*	HTML...
*	<div id="meu container_de_abas">
*		<ul> 
*			<li><a href="#alvo">Minha aba</a></li>
*		</ul>
*		<div>
*			<div id="alvo">Meu conteudo </div>
*		</div>
*	</div>
*	
*
*	Javascript...
*	new ABAS('id_do_container', aba_que_vai_comecar_aberta);
*
*	@param elemento String o id da div container
*	@param idAbaComeco int o indice da aba que deve comecar aberta (opcional) - default 0
*/
var ABAS = window.ABAS = function(elemento,idAbaComeco){
	
	/*
	*	var Boolean verifica se e IE
	*/
	var IE = (window.navigator.userAgent.search('MSIE') != -1);
	
	/*
	*	var Object HTML referncia para o container especificado
	*/
	var divConteudo = document.getElementById(elemento).childNodes;

	/*
	*	var Object HTML referncia para a ul da estrutura
	*/
	var ulAbas =  (IE) ? divConteudo[0] : divConteudo[1];
	
	/*
	*	var Object HTML referncia para as abas
	*/
	var abas = (IE) ? divConteudo[0].childNodes : divConteudo[1].childNodes;
	
	/*
	*	var Object HTML referncia para os conteudo que cada aba representa
	*/
	var abas_conteudo = (IE) ? divConteudo[1].childNodes : divConteudo[3].childNodes;

	/**
	*	var int e o indice da aba que vai comecar aberta, a primeira aba e a 0
	*/
	var abaComeco = idAbaComeco || 0;
	
	/*
	*	var int e um contador para o for entre os lnks das abas, se o link corresponder
	*/
	var cont = 0;
	
	ulAbas.className = 'abas'; //setando estilo css
	
	for(var i = 0; i < abas.length;i++){ //varrendo todos as lis da ul abas
		if(abas[i].nodeType == 1){ //elinando do for os textnodes
			
			/*
			*	para cada li varrida pega o primeiro filho que no caso e o link de cada volta
			*	do for, em seguida pega da div 'abas_conteudo', que tem o mesmo indice do link, pois e o seu
			*	conteudo em questao
			*/
			var a = abas[i].childNodes[0]; 
			var c = abas_conteudo[i];	   

			/*
			*	cada volta do for ele deixa de lado os textnodes, para cada link capturado, o cont e incrementado,
			*	assim o primeiro link e o cont 0, sendo assim o abacomeco 0 e a primeira aba, e assim respectivamente,
			*	esse if marca a aba que vai sair aberta, e desativa as outras
			*/
			if(cont == abaComeco){
				a.className = 'ativada';
				c.style.display = 'block';
			}else{
				a.className = 'desativado';
				c.style.display = 'none';
			}
			
			a.onclick = function(){ //evento do click de cada aba
			
				//for para desativar todos o links antes de ativar clicado
				for(var i = 0; i < abas.length;i++){
					if(abas[i].nodeType == 1){ //eliminando textnodes
						var a = abas[i].childNodes[0];
						a.className = 'desativado';
					}
				}
			
				/*
				*	varre todas as divs da div 'abas_conteudo', e compara se o href do link clicado e igual ao id da div,
				*	entao esta div e mostrada pois e o conteudo do link em questao, senao o div e ocultada
				*/
				for(var j = 0; j < abas_conteudo.length;j++){
					if(abas_conteudo[j].nodeType == 1){
						
						var thisHref = this.href.split('#')[1];	//formatando, posi o href vem desde o http				
						var contHref = abas_conteudo[j].id;	//id da div em questao no for
						
						if(thisHref == contHref){
							 abas_conteudo[j].style.display = 'block';
							 this.className = 'ativada';
						}else{
							abas_conteudo[j].style.display = 'none';
						}	
						
					}//if abas conteudo nodeType
				}//for abas conteudo
				
				return false;
			}//click function
			
		cont++;
			
		}//if nodeType		
	}//for inicial
	
}
	

})(window);
	
(function(window){

/**
*	class respnsavel por fazer o efeito de accodion
*	@author Robisson Cardoso de Oliveira
*	@date 04/05/2010
*
*	@CODE
*	HTML...
*	<div id="meu_slider">
*		<div>
*			<p>titulo slide</p>
*			<div>conteudo slide</div>
*		</div>
*	</div>
*
*	@param elemento String id da div container
*	@param idSlideAberto int indice do slide que vai comecar aberto
*
*/
	var Accordion = window.Accordion = function(elemento, idSlideAberto){
	
	/*
	*	var Boolean verifica se e IE
	*/
	var IE = (window.navigator.userAgent.search('MSIE') != -1);
	
	/*
	*	@var Object HTML referencia para a div mestre do slide
	*/
	this.container = document.getElementById(elemento); // div  geral do slider
	
	/*
	*	@var Object HTML referencia para cada slide do componente
	*/
	this.slides = this.container.childNodes; //divs slides
	
	/*
	*	@var int indice do slide que vai sar aberto, default 0
	*/
	this.slideComeco = idSlideAberto ;
	
	/*
	*	@var int numero de refencia para contar corretamente os slides
	*/
	this.cont = 0;
	
	document.getElementById(elemento).className = 'sgi_accordion';

	for(var s = 0; s < this.slides.length; s++ ){ //varrendo todos os slides
		if(this.slides[s].nodeType == 1){ //eliminando os textnodes
			
			var slides = this.slides; // todos os slides, abas e conteudo
			
			var slideAba = (IE) ? this.slides[s].childNodes[0] : this.slides[s].childNodes[1]; //aba clicada
			var slideConteudo = (IE) ? this.slides[s].childNodes[1] : this.slides[s].childNodes[3]; //conteudo da aba

			slideConteudo.className = 'slide_conteudo';

			if(typeof this.slideComeco == 'string'){
					slideAba.className = 'slide_header_ativo';
					slideConteudo.style.display = 'block';				
			}else{
				if(this.cont == this.slideComeco){ //mostrando a aba de comeco ou a primeira por padrao
					slideAba.className = 'slide_header_ativo';
					slideConteudo.style.display = 'block';
				}else{
					slideAba.className = 'slide_header';
					slideConteudo.style.display = 'none';
				}
			}
			
			$this = this; //pegando referncia do Slider
						
			slideAba.onclick = function(){ // clic da aba

				var conteudoClicado =  (IE) ? this.nextSibling : this.nextSibling.nextSibling; //div do conteudo abaixo da div clicada
				
				if(conteudoClicado.style.display != 'block'){ //fazer algo so se a div estiver fechada
			
					this.className = 'slide_header_ativo';

					conteudoClicado.style.display = 'block'; //abrindo os divs em questao

				}else{
					this.className = 'slide_header';

					conteudoClicado.style.display = 'none'; //abrindo os divs em questao
				}//if conteudo clicado
				
			}//click function
		
			this.cont++; 
		}//if slides nodetype
	}//for slides incial
		
}
	

})(window);

(function(){
	/*
	*	Metodo responsavel por formatar casa numericas em campos imput
	*   @var o1 elemento text alvo
	*	@var n1 
	*	@return void
	*/
	var FormataCampo = window.FormataCampo = function (o1, n1, dig1, dec1){
	
		addEvent = function(o, e, f, s){
			var r = o[r = "_" + (e = "on" + e)] = o[r] || (o[e] ? [[o[e], o]] : []), a, c, d;
			r[r.length] = [f, s || o], o[e] = function(e){
				try{
					(e = e || event).preventDefault || (e.preventDefault = function(){e.returnValue = false;});
					e.stopPropagation || (e.stopPropagation = function(){e.cancelBubble = true;});
					e.target || (e.target = e.srcElement || null);
					e.key = (e.which + 1 || e.keyCode + 1) - 1 || 0;
				}catch(f){}
				for(d = 1, f = r.length; f; r[--f] && (a = r[f][0], o = r[f][1], a.call ? c = a.call(o, e) : (o._ = a, c = o._(e), o._ = null), d &= c !== false));
				return e = null, !!d;
			}
		};
		 
		removeEvent = function(o, e, f, s){
			for(var i = (e = o["_on" + e] || []).length; i;)
				if(e[--i] && e[i][0] == f && (s || o) == e[i][1])
					return delete e[i];
			return false;
		};
		 
		function formataMoeda(o, n, dig, dec){
			o.c = !isNaN(n) ? Math.abs(n) : 2;
			o.dec = typeof dec != "string" ? "," : dec, o.dig = typeof dig != "string" ? "." : dig;
			addEvent(o, "keypress", function(e){
				if(e.key > 47 && e.key < 58){
					var o, s, l = (s = ((o = this).value.replace(/^0+/g, "") + String.fromCharCode(e.key)).replace(/\D/g, "")).length, n;
					if(o.maxLength + 1 && l >= o.maxLength) return false;
					l <= (n = o.c) && (s = new Array(n - l + 2).join("0") + s);
					for(var i = (l = (s = s.split("")).length) - n; (i -= 3) > 0; s[i - 1] += o.dig);
					n && n < l && (s[l - ++n] += o.dec);
					o.value = s.join("");
				}
				e.key > 30 && e.preventDefault();
			});
		}
		var decimal = (n1 != null) ? n1 : 2;		
		formataMoeda(o1, decimal, dig1, dec1);
	
	}		  
})(window);