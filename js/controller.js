/**
 * Created by lenovo on 2017/3/29.
 */
//将控制器单独写个模块
var app=angular.module('appModule.controller',[]);
app.controller('homeCtrl',function ($scope) {
         $scope.name='欢迎route'
})
app.controller('addCtrl',function ($scope,Book,$location) {
    $scope.add=function (p) {
        //console.log(p)
        Book.save(p).$promise.then(function () {
            $location.path('/list')
        })
    }
})
app.controller('listCtrl',function ($scope,Book) {
        $scope.books=Book.query();
})
app.controller('detailCtrl',function ($scope,Book,$routeParams,$location) {
    ///detail/3  /detail/:id=>$routeParams{id:3}
    $scope.id=$routeParams.id;
    $scope.book=Book.get({id:$scope.id})
    //删除书
    $scope.remove=function (p) {
        Book.delete({id:$scope.id}).$promise.then(function () {
            $location.path('/list')
        })
    };
    //修改
    $scope.flag=true;
    $scope.edite=function (p) {
        console.log(p)
        $scope.flag=!$scope.flag;
        $scope.temp=JSON.parse(JSON.stringify($scope.book))
    }
    $scope.shure=function () {
        Book.update({id:$scope.id},$scope.temp).$promise.then(function () {
            $scope.flag=true;
            $scope.book=$scope.temp;
        })
    }

})