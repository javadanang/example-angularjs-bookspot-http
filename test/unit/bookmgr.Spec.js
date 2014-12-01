describe("Book Management Controller Unit testing", function () {
  var controller, mockScope;

  // Set up the module
  beforeEach(angular.mock.module('bookspot'));

  beforeEach(angular.mock.inject(function($controller, $rootScope) {
    mockScope = $rootScope.$new();
    controller = $controller("bookmgr", {
      $scope: mockScope
    });
  }));

  it('assert the initial states of controller', function() {
    expect(mockScope.displayMode).toEqual("list");
    expect(mockScope.currentBook).toBeNull();
  });

  it('call listBooks() should return 5 books', function() {
    mockScope.listBooks();

    expect(mockScope.books.length).toEqual(5);
    for(var i=0; i<5; i++) {
      expect(mockScope.books[i].title).toEqual("Book" + (i + 1));
    }
  });

  it('call loadEditForm() without parameters', function() {
    mockScope.loadEditForm();

    expect(mockScope.displayMode).toEqual("edit");
    expect(mockScope.currentBook).not.toBeNull();
    expect(mockScope.currentBook.id).toBeUndefined();
  });

  it('call loadEditForm() with a valid book', function() {
    var book = { id: '552b3ca5-cd81-40e7-97c6-3bcd2a3bec17', title: "Book3", 
          category: "Programming Language", price: 4.25 };

    mockScope.loadEditForm(book);

    expect(mockScope.displayMode).toEqual("edit");
    expect(mockScope.currentBook).not.toBeNull();
    expect(mockScope.currentBook.id).toEqual('552b3ca5-cd81-40e7-97c6-3bcd2a3bec17');
    expect(mockScope.currentBook.title).toEqual("Book3");
  });

  it('call cancelEditForm() to comeback to list', function() {
    mockScope.loadEditForm();
    mockScope.cancelEditForm();

    expect(mockScope.displayMode).toEqual("list");
    expect(mockScope.currentBook).toBeNull();
  });

  it('call saveEditForm() with defined ID', function() {
    var book = { id: 'e48f724a-f332-4a6d-be37-e21d9a94db89', title: "Book4", 
          category: "Programming Language", price: 3.15 };

    spyOn(mockScope, 'createBook');
    spyOn(mockScope, 'updateBook');

    mockScope.saveEditForm(book);

    expect(mockScope.updateBook).toHaveBeenCalled();
    expect(mockScope.updateBook.calls.count()).toEqual(1);
    expect(mockScope.createBook.calls.count()).toEqual(0);
  });

  it('call saveEditForm() with undefined ID', function() {
    var book = { };

    spyOn(mockScope, 'createBook');
    spyOn(mockScope, 'updateBook');

    mockScope.saveEditForm(book);

    expect(mockScope.createBook).toHaveBeenCalled();
    expect(mockScope.createBook.calls.count()).toEqual(1);
    expect(mockScope.updateBook.calls.count()).toEqual(0);
  });

  it('call createBook() to new edit form', function() {
    var totalBooks = mockScope.books.length;

    var book = { id: 'e2dadcfe-dca7-456a-adf3-ec199e811c40', name: "Book6", 
        category: "Programming Language", price: 3.15 };

    mockScope.createBook(book);

    expect(mockScope.books.length).toEqual(totalBooks + 1);
    expect(mockScope.displayMode).toEqual("list");
  });

  it('call updateBook() to save edit form', function() {
    var totalBooks = mockScope.books.length;

    var book = { id: '552b3ca5-cd81-40e7-97c6-3bcd2a3bec17', 
          title: "Book3 (New)", 
          category: "Programming Language", price: 6.75 };

    mockScope.updateBook(book);

    expect(mockScope.books.length).toEqual(totalBooks);
    expect(mockScope.displayMode).toEqual("list");

    expect(mockScope.books[2].title).toEqual("Book3 (New)");
    expect(mockScope.books[2].price).toEqual(6.75);
  });

  it('call deleteBook() to remove book', function() {
    var totalBooks = mockScope.books.length;

    var book = { id: 'e48f724a-f332-4a6d-be37-e21d9a94db89', title: "Book4", 
          category: "Programming Language", price: 3.15 };

    mockScope.deleteBook(book);

    expect(mockScope.displayMode).toEqual("list");
    expect(mockScope.books.length).toEqual(totalBooks - 1);
  });
});
