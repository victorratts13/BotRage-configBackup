/*
    BotRage V2.2 
    author: Victor Ratts
    linguagem: Js
    distrib.: LICENSIADO
    dependencias: Vide pacage.json

    bot com inplantação para bitmenx
    uso comercial
*/

//primeiras definições
const request = require('request');
const renko = require('technicalindicators').renko;
const SMA = require('technicalindicators').SMA;
var crypto = require('crypto');
const setTime = 10 * 1000;
const config = require('./config/config');
const user = config.user;
const frontPort = config.port;
const frontRequest = config.locaRequest+frontPort;
const symbolDefault = 'XBTUSD';
const uriPost = config.remoteRequest;
//api keys
const apiKey = config.keyId;
const apiSecret = config.keySecr;

//execução de ordens
setInterval(() => {
    //variaveis ambientais
    var link = frontRequest+'/history';
    var unix = new Date().getTime() / 1000;
    var timeUnix = parseInt(unix);
    var outUnix = timeUnix - 48000;
    var query = `?symbol=${symbolDefault}&from=${outUnix}&to=${timeUnix}&resolution=1`;

    request({
        url: link + query,
        json: true
    }, (err, response, body) => {
       // body = JSON.stringify(body);
        if(err){
            console.log('\033c algum problema de requisição, verifique o erro -> '+ err);
        }else{
            console.log('\033c Bem-Vindo ao BotRage v1.0 \n \x1b[33m dados obtidos com sucesso, trabalhando com informações \n Usuario: '+user);
            var actualValue = body.c.slice(-1)[0];
            var actualValueBuy = body.h.slice(-1)[0];
            var actualValueSell = body.l.slice(-1)[0];
//=======================================Metodos de compra, venda, close, Stop=================================
            var
            POST = 'POST',
            Del = 'DELETE',
            path = '/api/v1/order',
            pathClose = '/api/v1/order/closePosition',
            expire = new Date().getTime() / 1000, // 1 min in the future
            expires = parseInt(expire) + 60,
            //objeto de compra
            buy = {
                symbol: symbolDefault,//par
                orderQty: 31,//quantidade de contratos
                //price: actualValueBuy,//preço limit
                ordType:"Market",//tipo
                //stopPx: actualValue - 70, // (5*actualValue/100), //% do Stop
                side: "Buy"
                },
            //Objeto de venda    
            sell = {
                symbol: symbolDefault,//par
                orderQty: 31,//quantidade de contratos
                //price: actualValueSell,//preço limit
                ordType:"Market",//tipo
                //stopPx: actualValue + 70, // (5*actualValue/100),//% do stop
                side: "Sell"
                },
            //Objeto de fechamento
            close = {
                symbol: symbolDefault
            },
            Dell = {
                symbol: symbolDefault,
                text: 'Send From BotRage V1.0'
            },
            //Objeto de stop - Compra
            stopBuy = {
                symbol: symbolDefault,//par
                orderQty: 31,//quantidade de contratos
                //price: actualValue - 1,//preço limit
                ordType:"Stop",//tipo
                stopPx: actualValue - 170, //% do Stop
                side: "Sell"
                },
            //Objeto de stop - Venda    
            stopSell = {
                symbol: symbolDefault,//par
                orderQty: 31,//quantidade de contratos
                //price: actualValue + 1,//preço limit
                ordType:"Stop",//tipo
                stopPx: actualValue + 170, //% do Stop
                side: "Buy"
            }    

//###########################################################################################################
//################## atribuição de valores a chave de conexão - Crypt for SHA-256 ###########################
//###########################################################################################################

//==================compra========================buy========================================================

                var postBody = JSON.stringify(buy);

                var signatureBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Buy -> '+signatureBuy);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureBuy
                };
                const requestOptionsBuy = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
            }
//===============venda============================sell==========================================================
                var postBody = JSON.stringify(sell);

                var signatureSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Sell -> '+signatureSell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureSell
                };
                const requestOptionsSell = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }
//==============Close=============================Fechamento====================================================
                var postBody = JSON.stringify(close);

                var signatureClose = crypto.createHmac('sha256', apiSecret).update(POST + pathClose + expires + postBody).digest('hex');
                console.log('Assinatura Close -> '+signatureClose);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureClose
                };
                const requestOptionsClose = {
                headers: headers,
                url: uriPost + pathClose,
                method: POST,
                body: postBody 
                }
//=============StopBuy==========================================================================================
                var postBody = JSON.stringify(stopBuy);

                var signatureStopBuy = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/buy -> '+signatureStopBuy);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureStopBuy
                };
                const requestOptionsStopBuy = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }                
//==============StopSell========================================================================================
                var postBody = JSON.stringify(stopSell);

                var signatureStopSell = crypto.createHmac('sha256', apiSecret).update(POST + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/Sell -> '+signatureStopSell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureStopSell
                };
                const requestOptionsStopSell = {
                headers: headers,
                url: uriPost + path,
                method: POST,
                body: postBody 
                }
//======================================Delete==================================================================
                var postBody = JSON.stringify(Dell);

                var signatureDell = crypto.createHmac('sha256', apiSecret).update(Del + path + expires + postBody).digest('hex');
                console.log('Assinatura Stop/Sell -> '+signatureDell);
                var headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signatureDell
                };
                const requestOptionsDell = {
                headers: headers,
                url: uriPost + path,
                method: Del,
                body: postBody 
                }

//##############################################################################################################
//############################# Funções do BOT, Medias Moveis, Compra e venda ##################################
//##############################################################################################################
                
//============================= renko ==========================================================================

            var renkoType = {
                "close": body.c,
                "open": body.o,
                "volume": body.v,
                "high": body.h,
                "low": body.l,
                "timestamp": body.t
            };
            var result = renko(Object.assign({}, renkoType, {period: 0.5, brickSize : 5, useATR : false }));
            //console.log(result);
            var JsonResult = {
                "c": result.close,
                "o": result.open,
                "v": result.volume,
                "h": result.high,
                "l": result.low,
                "t": result.timestamp,
                "s": 'ok'
            }
            //console.log(JsonResult);

//==============================Medias Moveis =================================================================

            //Definição de Medias Moveis
          MA1 = SMA.calculate({period: 1, values: JsonResult.c});
          MA2 = SMA.calculate({period: 21, values: JsonResult.c});
          console.log('\n');//quebra de linha
          console.log('MA01 periodo 01 '+MA1.slice(-1)[0]);
          console.log('MA02 periodo 21 '+MA2.slice(-1)[0]);

//=============================== Lista de ordens e efetuando cruzamentos =============================================================          

//------------------------ dados da ultima ordem ----------------------------------------------------------
request({
    url: frontRequest + '/orders',
    json: true
}, (err, response, body) => {
    if(err){
        console.log('erro inesperado de requisição de ordens -> '+err);
    }else{

    console.log(
        '\n' +
        'ultimo Side -> '+ body.side + '\n' +
        'ultimo price -> '+ body.price + '\n' +
        'ultimo Valor Stop -> '+ body.stopPx + '\n' +
        'ultimo Moeda -> '+ body.currency + '\n' +
        'ultimo Tipo -> '+ body.ordType + '\n' +
        'ultimo Status -> '+ body.ordStatus + '\n' +
        'ultimo Time -> '+ body.transactTime + '\n' +
        'Preço Atual de mercado -> ' + actualValue + '\n' 
    );

    if(body.side == 'Buy'){
        console.log('\x1b[31m Compra foi executada \n');
    }
    if(body.side == 'Sell'){
        console.log('\x1b[31m Venda foi executada \n');
    }
    if(body.stopPx == null){
        console.log('Ultimo stop lançado é Nulo \n')
    }

//##############################################################################################################
//######################################### Referenciais do FrontEnd ###########################################
//##############################################################################################################

//-------------------------------------------functions----------------------------------------------------------

//função de compra
function buyFunction(){
        if(body.side == 'Sell'){
            //Fechando Ordens
            console.log('parada para compra');
            request(requestOptionsClose, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
            });
            //delete
            console.log('Deletando Ordens Abertas');
            request(requestOptionsDell, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
            });

        }
        setTimeout(() => {   
            //stop
            request(requestOptionsStopBuy, function(error, response, body) {
                if (error) { console.log(error); }
                console.log(body);
            });
            //Ordem de Venda
                console.log(' \x1b[32m executando compra:');
                request(requestOptionsBuy, function(error, response, body) {
                if (error) { console.log(error); }
                console.log(body);
            });
        }, 2000);   
}

//função de venda
function sellFunction(){
    if(body.side == 'Buy'){                   
            //Fechando Ordens abertas
            console.log('parada para Venda');
            request(requestOptionsClose, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
            });
            //delete
            console.log('Deletando Ordens Abertas');
            request(requestOptionsDell, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
            });
        }
    setTimeout(() => {
            //Stop
            request(requestOptionsStopSell, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
             });   
            //Ordem de Venda
            console.log(' \x1b[32m executando Venda:');
            request(requestOptionsSell, function(error, response, body) {
            if (error) { console.log(error); }
            console.log(body);
        });
    }, 2000)
}

//------------------------ cruzamento 01 - Compra --------------------------------------------------------------------------
                    if(MA1.slice(-1)[0] > MA2.slice(-1)[0]){//condicional de cruzamento
                            if(body.side == 'Buy'){
                                console.log('Compra executada... Aguardando Venda');
                            }else{
                                buyFunction();
                            }
                        }else{
                        console.log('Aguardando proximo Cruzamento...')
                    }
//------------------------ Cruzamento 02 - Venda -------------------------------------------------------------------------
                    if(MA1.slice(-1)[0] < MA2.slice(-1)[0]){//condicional de cruzamento
                        if(body.side == 'Sell'){
                            console.log('Venda executada... Aguardando Compra');
                        }else{
                            sellFunction();
                        }
                    }else{
                        console.log('Aguardando proximo Cruzamento...')
                    }
                }
        
            });
//###############################################################################################################
//######################################### Fim do Codigo #######################################################                    
//###############################################################################################################
        }//linha do else

    })//fim do request principal
    
}, setTime);
