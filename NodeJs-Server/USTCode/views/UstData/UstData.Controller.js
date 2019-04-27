
(function(){
    'use strict'
    angular.module("myApp").controller('ustData.controller', function($scope, $http, messagesProviderService){

        var vm = this;
        let counterRetrieveData = 0;
    
    
        vm.retrieveData = function(){
            var request = $http({  
                method:"get",
                url: "https://jsonplaceholder.typicode.com/todos" //change This Url Line to Test Another API Call for Empty Results
                }).then(function mySuccess(response) {
                    console.log(response.data);
                    console.log(response.status);
                    if(response.data.length > 0 && response.status == 200){
                        vm.arrayUSTData = response.data;
                        fillDataTableUSTData();
                    }
                    else if(counterRetrieveData == 2){
                        messagesProviderService.errorAlertMessage("Error Getting Information", "There is no Information Available"); 
                    }
                    else if(response.status != 200){
                        console.log('try '+counterRetrieveData);
                        counterRetrieveData+=1;
                        vm.retrieveData();//Call API Again
                    }
                    
                },function myError(response) {
                    console.log(response.data);
                    console.log(response.status);

                    counterRetrieveData++;
                    if(counterRetrieveData > 2){
                        messagesProviderService.errorAlertMessage("Error Getting Information", "There is no Information Available"); 
                    }
                    else if(response.status != 200){
                        console.log('try '+counterRetrieveData);
                        counterRetrieveData+=1;
                        vm.retrieveData(); //Call API Again
                    }
                }); 
        };

        function fillDataTableUSTData(){
            $('#dtUSTData').DataTable().destroy();
            $('#dtUSTData').DataTable( {
                scrollY:        '50vh',
                scrollCollapse: true,
                searching: false,
                paging:         false,
                info: false,
                ordering: false
            });
        };
    });
})();

