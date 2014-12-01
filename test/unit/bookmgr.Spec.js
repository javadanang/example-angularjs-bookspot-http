describe("Book Management Controller Unit testing", function () {
  var controller, mockScope, $httpBackend, baseUrl;

  // Set up the module
  beforeEach(angular.mock.module('bookspot'));

  beforeEach(angular.mock.inject(
      function($controller, $rootScope, _$httpBackend_, _baseUrl_) {
    mockScope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    baseUrl = _baseUrl_;
    controller = $controller("bookmgr", {
      $scope: mockScope
    });
  }));

  it('assert the initial states of controller', function() {
    expect(mockScope.displayMode).toEqual("list");
    expect(mockScope.currentBook).toBeNull();
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('call listBooks() should return 5 books', function() {

    $httpBackend.expect('GET', baseUrl).respond(200, [
      { id: '3455f5af-db4b-49a8-8222-0d8fa6b6d9d3', title: "Book_1", 
          category: "Programming Language", price: 1.25 },
      { id: '18c83bc3-9607-4f26-8281-cb360afb41bc', title: "Book_2", 
          category: "Programming Language", price: 2.45 },
      { id: '552b3ca5-cd81-40e7-97c6-3bcd2a3bec17', title: "Book_3", 
          category: "Programming Language", price: 4.25 },
      { id: 'e48f724a-f332-4a6d-be37-e21d9a94db89', title: "Book_4", 
          category: "Programming Language", price: 3.15 },
      { id: '607b0ff8-2222-4c64-8f45-62c85b70b2f5', title: "Book_5", 
          category: "Programming Language", price: 4.25 }
    ]);

    mockScope.listBooks();

    $httpBackend.flush();

    expect(mockScope.books.length).toEqual(5);
    for(var i=0; i<5; i++) {
      expect(mockScope.books[i].title).toEqual("Book_" + (i + 1));
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

    var iBook = { name: "Book6", 
        category: "Programming Language", price: 3.15 };

    var oBook = new Object(iBook);
    oBook.id = 'e2dadcfe-dca7-456a-adf3-ec199e811c40';

    $httpBackend.expectPOST(baseUrl, iBook).respond(200, oBook);

    mockScope.createBook(iBook);

    $httpBackend.flush();

    expect(mockScope.books.length).toEqual(totalBooks + 1);
    expect(mockScope.books[totalBooks]).toEqual(oBook);
    expect(mockScope.displayMode).toEqual("list");
  });

  it('call updateBook() to save edit form', function() {
    var totalBooks = mockScope.books.length;

    var iBook = new Object(mockScope.books[2]);
    iBook.title = "Book3 (New)";
    iBook.price = 6.75; 

    var oBook = new Object(iBook);

    $httpBackend.expectPUT(baseUrl + iBook.id, iBook).respond(200, oBook);

    mockScope.updateBook(iBook);

    $httpBackend.flush();

    expect(mockScope.books.length).toEqual(totalBooks);
    expect(mockScope.displayMode).toEqual("list");

    expect(mockScope.books[2].title).toEqual(oBook.title);
    expect(mockScope.books[2].price).toEqual(oBook.price);
  });

  it('call deleteBook() to remove book', function() {
    var totalBooks = mockScope.books.length;

    var book = new Object(mockScope.books[3]);

    $httpBackend.expectDELETE(baseUrl + book.id).respond(200, 'Ok');

    mockScope.deleteBook(book);

    $httpBackend.flush();

    expect(mockScope.displayMode).toEqual("list");
    expect(mockScope.books.length).toEqual(totalBooks - 1);

    for(var i=0; i<mockScope.books.length; i++) {
      expect(mockScope.books[i].id).not.toEqual(book.id);
    }
  });
});
