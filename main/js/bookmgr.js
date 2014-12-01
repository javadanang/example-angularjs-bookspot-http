var app = angular.module('bookspot', []);

app.constant("baseUrl", "http://localhost:5500/books/");
app.controller('bookmgr', ['$scope', '$http', 'baseUrl', 
    function($scope, $http, baseUrl) {

  $scope.displayMode = "list";
  $scope.currentBook = null;
  $scope.books = [
    { id: '3455f5af-db4b-49a8-8222-0d8fa6b6d9d3', title: "Book1", 
        category: "Programming Language", price: 1.25 },
    { id: '18c83bc3-9607-4f26-8281-cb360afb41bc', title: "Book2", 
        category: "Programming Language", price: 2.45 },
    { id: '552b3ca5-cd81-40e7-97c6-3bcd2a3bec17', title: "Book3", 
        category: "Programming Language", price: 4.25 },
    { id: 'e48f724a-f332-4a6d-be37-e21d9a94db89', title: "Book4", 
        category: "Programming Language", price: 3.15 },
    { id: '607b0ff8-2222-4c64-8f45-62c85b70b2f5', title: "Book5", 
        category: "Programming Language", price: 4.25 }
  ];

  $scope.listBooks = function () {
    $http.get(baseUrl).success(function (data) {
      $scope.books = data;
    });
  }

  $scope.loadEditForm = function (book) {
    $scope.currentBook = book ? angular.copy(book) : {};
    $scope.displayMode = "edit";
  }

  $scope.cancelEditForm = function () {
    $scope.currentBook = null;
    $scope.displayMode = "list";
  }

  $scope.saveEditForm = function (book) {
    if (angular.isDefined(book.id)) {
      $scope.updateBook(book);
    } else {
      $scope.createBook(book);
    }
  }

  $scope.createBook = function (book) {
    book.id = generateUUID();
    $scope.books.push(book);
    $scope.displayMode = "list";
  }

  $scope.updateBook = function (book) {
    for (var i = 0; i < $scope.books.length; i++) {
      if ($scope.books[i].id == book.id) {
        $scope.books[i] = book;
        break;
      }
    }
    $scope.displayMode = "list";
  }
  
  $scope.deleteBook = function (book) {
    $scope.books.splice($scope.books.indexOf(book), 1);
  }

  var generateUUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
        replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
      return uuid;
  };
}]);
