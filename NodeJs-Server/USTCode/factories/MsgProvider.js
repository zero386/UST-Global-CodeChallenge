(function(){
  'use strict'
  angular.module("myApp").factory('messagesProviderService', function(){

    return {
      successAlertMessage : function(textHeader, textMessage){
        $.uiAlert({
            textHead: textHeader, // header
            text: textMessage, // Text
            bgcolor: '#19c3aa', // background-color
            textcolor: '#fff', // color
            position: 'top-center',// position . top And bottom ||  left / center / right
            icon: 'checkmark box', // icon in semantic-UI
            time: 3, // time
        });
      },

      errorAlertMessage : function (textHeader, textMessage){
        $.uiAlert({
                textHead: textHeader, // header
                text: textMessage, // Text
                bgcolor: '#DB2828', // background-color
                textcolor: '#fff', // color
                position: 'top-center',// position . top And bottom ||  left / center / right
                icon: 'remove circle', // icon in semantic-UI
                time: 3, // time
            })
      }

    };//return
});
})()
