var app = angular.module('bookspot', []);

app.constant("baseUrl", "http://localhost:5500/books/");
app.controller('bookmgr', ['$scope', '$http', 'baseUrl', 
    function($scope, $http, baseUrl) {

  $scope.displayMode = "list";
  $scope.currentBook = null;
  $scope.books = [];

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
    $http.post(baseUrl, book).success(function (newBook) {
      $scope.books.push(newBook);
      $scope.displayMode = "list";
    });
  }

  $scope.updateBook = function (book) {
    $http.put(baseUrl + book.id, book)
        .success(function (returnedBook) {
      for (var i = 0; i < $scope.books.length; i++) {
        if ($scope.books[i].id == returnedBook.id) {
          $scope.books[i] = returnedBook;
          break;
        }
      }
      $scope.displayMode = "list";
    });
  }
  
  $scope.deleteBook = function (book) {
    $http.delete(baseUrl + book.id).success(function () {
      $scope.books.splice($scope.books.indexOf(book), 1);
    });
  }
}]);
