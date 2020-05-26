/**
 * Controle principal da aplicação
 * @author Carlos Brito {carlosmcp@gmail.com}
 * @since 1.0 26/07/2017
 * 
 */
'use strict';

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const STATUS = Object.freeze({
    ENVIANDO: "sms 1/1",
    ERRO_ENVIO: "..erro",
    ENVIADA: "..ok"
});

module.exports = function() {
    
    var extractErroMessage = function(message)  {

        if (data.indexOf(STATUS.ENVIANDO) === -1 || data.indexOf(STATUS.ERRO_ENVIO) !== -1) { //Sending SMS 1/1....waiting for network answer..error 500, message reference=-1
            retorno.log = data;
       } else { //Sending SMS 1/1....waiting for network answer..OK, message reference=207
            retorno.log = data;
            retorno.enviada = true;
       }

    }

    /**
     * Enviar Mensagem SMS
     * @param  {Integer}  telefone Número do telefone
     * @param  {String}   texto    Mensagem a ser enviada
     * @param  {Function} callback Função de retorno
     * @return {Void}     
     */
    var sendMessage = async function(phone, message) {
       try {
           const command = `gammu sendsms text ${phone} -text \"${message}\" `;
           await exec(command);
       } catch (e) {
           throw e
       }      
       
        
     /*   if (data.indexOf(STATUS.ENVIANDO) === -1 || data.indexOf(STATUS.ERRO_ENVIO) !== -1) { //Sending SMS 1/1....waiting for network answer..error 500, message reference=-1
             retorno.log = data;
        } else { //Sending SMS 1/1....waiting for network answer..OK, message reference=207
             retorno.log = data;
             retorno.enviada = true;
        } */

       // callback(null, retorno);        
    }

    /**
     * Enviar Mensagens em Lote
     * @param  {Object} listaTelefonesTexto Map {telefone, mensagem}
     * @param  {Function} callback Função de retorno
     * @return {Void}  
     */
    var sendMessageBulk = function(listaTelefonesTexto, callback) {
        //console.log("\nEnviando " + listaTelefonesTexto.length + " mensagen(s)");
        //var count = 1;
        async.mapLimit(listaTelefonesTexto, 1, function(registro, callbackEnvio) {
            console.log("Enviando " + count + "/" + listaTelefonesTexto.length + "...");
            count++;
            sendMessage(registro.telefone, registro.mensagem, function(err, result) {
                if (err) {
                    callbackEnvio(err);
                } else {
                    registro.log = result.log;
                    registro.enviada = result.enviada;
                    registro.cmd = result.cmd;
                    callbackEnvio(null, registro);
                }
            });

        }, callback);
    }


    return {
        sendMessage: sendMessage,
        sendMessageBulk: sendMessageBulk
    };
}