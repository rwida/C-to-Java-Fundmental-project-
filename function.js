new Vue({
	'el': '#app',
	data: {
		textOne: '',
		textTwo: '',
		Lines: [],
		regIdentifers: (/^[a-zA-Z_][a-zA-Z0-9_]*$/),
		regKeywords: (/^(if|else|switch|case|default|break|int|float|char|char\*\*|double|long|for|while|do|void|goto|auto|signed|const|extern|register|unsigned|return|continue|enum|sizeof|struct|typedef|union|volatile|main)$/),
		reg2SpecialSymbol: (/^(;|~|!|#|%|\^|\$|&|\*|\)|\(|_|\+|\\|`|-|=|{|}|\[|]|:|"|<|>|\?|.|,|\/)$/),
		regSpecialSymbol: /^[\t\r\n\f\s!;@#$%^&*(),.?\'\"+-=:{}|<>]*$/gi,
		strSpecialSymbol: ';,',
		regSpecialwithSpace: /^[!,;]*$/,
		multyComments: /^\/*.*\/$/,
		lineComments: /^(\/\/).*$/,
		formatSpecifier: (/^%(d|f|c)/g),
		regStr: (/^\".*\"$/g),
		errStr: null,
		escapeSequences: (/^(\n|\t|\r|\v|\a|\\b)/g),
		regIntNumbers: /^[0-9][0-9]*$/,
		regRealNumbers: /^[0-9][0-9]*[\.][0-9][0-9]*$/,
		syntx: [{
				'keyword': /int/g,
				'signOpertator': /=/g,
				'value': /(?<=\s|^)\d+(?=\s|$)/g
						
			},
			{
				'keyword': /float/g,
				'signOpertator': /=/g,
				'value': /[0-9][\.][0-9]/g
			},
			{
				'keyword': /double/g,
				'signOpertator': /=/g,
				'value': /[0-9][\.][0-9]/g
			},
			{
				'keyword': /string/g,
				'signOpertator': /=/g,
				'value': /"(.)*"/g
			},
			{
				'keyword': /char/g,
				'signOpertator': /=/g,
				'value': /"(.)*"/g
			}
		],

	},
	computed: {},
	methods: {
		syntax(data) {
			if (data == "int") {

			}
		},
		convert() {
			this.textTwo = "";
			this.SyntaxPhase(this.textOne);
		},
		SyntaxPhase(input) {
			var res = this.regWithSpace(input);
			var inputArray = res.split(/[ \t\r\n\f]/);
			this.errStr = null;
			for (var i = 0; i < inputArray.length; i++) {
				this.LexicalPhase(inputArray[i]);
				if(this.LexicalPhase(inputArray[i])){
					this.errStr = "error";
				}
			}
			if (this.errStr != null) {
				this.textTwo = "Lexical Error";
			} else {
				this.textTwo = input;
				var res2 = input.replace(/[;]/gi, '$&\n');
				this.Lines = this.LinebyLine(res2);
				this.Lines = this.Lines.filter(item => item);
				console.log(this.Lines);
				
				for(var i=0; i<this.Lines.length; i++)
				{
					console.log(this.Lines);
					
					var lineToken = this.regWithSpace(this.Lines[i]).split(" ");
					lineToken = lineToken.filter(item => item);
					console.log(this.Lines[i][this.Lines[i].length-1]);
					console.log(lineToken);
					if(this.Lines[i][this.Lines[i].length-1].match(/[;]/g)){
						
						if (this.CheckDataInit(lineToken[0])) {
							console.log(lineToken[0] + " keyword Done");
							if (this.CheckIdentiferInit(lineToken[1])) {
								console.log(lineToken[1] + " identifer Done");
								if(lineToken.length == 5){
								if (this.CheckOperationInit(lineToken[2])) {
									console.log(lineToken[2] + " operator Done");
									if (this.CheckNumberInit(lineToken[0],lineToken[3])) {
										console.log(lineToken[3] + " naumber!");
										
									} else {
										console.log( "syntax error num");
										this.textTwo = "Syntax Error";
									}
								}else{
									console.log( "syntax error op");
									this.textTwo = "Syntax Error";
								}
							}
							else{
								if(lineToken.length == 3){
									if (this.CheckDataInit(lineToken[0])) {
										console.log(lineToken[0] + " keyword Done");
										if (this.CheckIdentiferInit(lineToken[1])) {
											console.log(lineToken[1] + " identifer Done");
										}else{
											console.log( "syntax error id");
											this.textTwo = "Syntax Error";
										}
									}else{
										console.log( "syntax error key");
										this.textTwo = "Syntax Error";
									}

								}
								else{
									console.log( "syntax error op");
									this.textTwo = "Syntax Error";
								}
							}
							
							}else{
								console.log( "syntax error id");
								this.textTwo = "Syntax Error";
							}
							}else{
								console.log( "syntax error key");
								this.textTwo = "Syntax Error";
							}
					}
					else{
						console.log("Syntax Error! ;");
						this.textTwo = "Syntax Error";
					}
					
					
					
				}
				
				


			}
		},
		CheckDataInit(input){
			for(var j=0; j<this.syntx.length; j++){
				if (input.match(this.syntx[j].keyword)) {
					return true;
			}
			
		}
		},
		CheckIdentiferInit(input){
			if (input.match(this.regIdentifers)) {
				return true;
		}
		
		},
		CheckOperationInit(input){
			for(var j=0; j<this.syntx.length; j++){
				if (input.match(this.syntx[j].signOpertator)) {
					
					return true;
			}
		}
		},
		CheckNumberInit(key,input){
			for(var j=0; j<this.syntx.length; j++){
				if (key.match(this.syntx[j].keyword)){
				if (input.match(this.syntx[j].value)) {
					return true;
			}}
		}
		},
		LexicalPhase(input) {
			if (this.CheckregStr(input)) {
				console.log("'" + input + "'" + " valid String!");
			} else {
				if (this.CheckKeywords(input)) {
					console.log("'" + input + "'" + " valid Keyword!");
				} else {
					if (this.CheckIntNumbers(input)) {
						console.log("'" + input + "'" + " valid Int Number!");
					} else {
						if (this.CheckRealNumbers(input)) {
							console.log("'" + input + "'" + " valid Real Number!");
						} else {
							if (this.CheckIdentifers(input)) {
								console.log("'" + input + "'" + " valid Identifer!");
							} else {
								if (this.CheckSpecialSymbol(input)) {
									console.log("'" + input + "'" + " valid Special Symbol!");
								} else {
									if (this.CheckFormatSpecifier(input)) {
										console.log("'" + input + "'" + "valid format specifier! ");
									} else {
										if (this.CheckLineComments(input)) {
											console.log("'" + input + "'" + "valid Line comment!");
										} else {
											if (this.CheckMultyComments(input)) {
												console.log("'" + input + "'" + "valid Multi comment!");
												// return true;
											} else {
												if (this.CheckeScapeSequences(input)) {
													console.log("'" + input + "'" + "valid Scape Sequences!");
												} 
												else {
													
													console.log("'" + input + "'" + "Lexical Error!");
													
													return true;
												}


											}
										}

									}


								}
							}

						}
					}
				}
			}
		},
		CheckIdentifers(input) {

			if ((input.match(this.regIdentifers))) {
				return true;
			} else {
				return false;
			}
		},
		CheckIntNumbers(input) {

			if ((input.match(this.regIntNumbers))) {
				return true;
			} else {
				return false;
			}
		},
		CheckRealNumbers(input) {

			if ((input.match(this.regRealNumbers))) {
				return true;
			} else {
				return false;
			}
		},
		CheckKeywords(input) {
			if ((input.match(this.regKeywords))) {
				return true;
			} else {
				return false;
			}
		},
		CheckSpecialSymbol(input) {
			if ((input.match(this.regSpecialSymbol))) {
				return true;
			} else {
				return false;
			}
		},
		CheckMultyComments(input) {
			if ((input.match(this.multyComments))) {
				return true;
			} else {
				return false;
			}
		},
		CheckLineComments(input) {
			if ((input.match(this.lineComments))) {
				return true;
			} else {
				return false;
			}
		},
		CheckFormatSpecifier(input) {
			if ((input.match(this.formatSpecifier))) {
				return true;
			} else {
				return false;
			}
		},
		CheckregStr(input) {
			if ((input.match(this.regStr))) {
				return true;
			} else {
				return false;
			}
		},
		CheckeScapeSequences(input) {
			if ((input.match(this.escapeSequences))) {
				return true;
			} else {
				return false;
			}
		},
		regWithSpace: (string) => {
			return string.replace(/[;=]/g, ' $& ')
		},
		LinebyLine(input) {
			var inputArray = input.split(/\n/);
			return inputArray;
		},


	},


}); 