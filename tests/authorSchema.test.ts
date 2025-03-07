import Author from "../models/author";

describe('Verify author schema', () => {
    test('should be invalid if first name is empty', async () => {
        const author = new Author({});
        author.family_name = 'Doe';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.first_name).toBeDefined();
    });

    test('should be invalid if first name is greater than 100 characters', async () => {
        const author = new Author({});
        author.first_name = 'a'.repeat(101);
        author.family_name = 'Doe';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.first_name).toBeDefined();
    });

    test('should be invalid if family name is empty', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.family_name).toBeDefined();
    });

    test('should be invalid if family name is greater than 100 characters', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.family_name = 'a'.repeat(101);
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.family_name).toBeDefined();
    });

    test('should be invalid if date of birth is not a valid date', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.family_name = 'Doe';
        author.date_of_birth = new Date('2020-27-12');
        author.date_of_death = new Date('2020-12-27');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.date_of_birth).toBeDefined();
    });

    test('should be invalid if date of death is not a valid date', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.family_name = 'Doe';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-27-12');
        const validationError = author.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.date_of_death).toBeDefined();
    });
});

describe('Verify author schema virtuals', () => {
    test('should return the full name of the author', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.family_name = 'Doe';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        expect(author.name).toBe('Doe, John');
    });

    test('should return empty string if first name is missing', async () => {
        const author = new Author({});
        author.first_name = '';
        author.family_name = 'Doe';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        expect(author.name).toBe('');
    });

    test('should return empty string if family name is missing', async () => {
        const author = new Author({});
        author.first_name = 'John';
        author.family_name = '';
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        expect(author.name).toBe('');
    });

    test('should return empty string if both first and family names are missing', async () => {
        const author = new Author({});
        author.date_of_birth = new Date('1990-01-01');
        author.date_of_death = new Date('2020-01-01');
        expect(author.name).toBe('');
    });

    test('should return string birth - death if both dates are present', async () => {
        const author = new Author({
            first_name: 'John',
            family_name: 'Doe',
            date_of_birth: new Date('1990-01-09'),
            date_of_death: new Date('2020-12-27')
        });
        expect(author.lifespan).toBe('1990 - 2020');
    });

    test('should return string birth - if only date of birth is present', async () => {
        const author = new Author({
            first_name: 'John',
            family_name: 'Doe',
            date_of_birth: new Date('1990-01-09')
        });
        expect(author.lifespan).toBe('1990 - ');
    });

    test('should return string - death if only date of death is present', async () => {
        const author = new Author({
            first_name: 'John',
            family_name: 'Doe',
            date_of_death: new Date('2020-12-27')
        });
        expect(author.lifespan).toBe(' - 2020');
    });

    test('should return string - if both dates are missing', async () => {
        const author = new Author({
            first_name: 'John',
            family_name: 'Doe'
        });
        expect(author.lifespan).toBe(' - ');
    });
});

describe('Verify author counting', () => {
    const authors = [
        { first_name: 'John', family_name: 'Doe', date_of_birth: new Date('1958-10-10'), date_of_death: new Date('2020-01-01') },
        { first_name: 'Jane', family_name: 'Doe', date_of_birth: new Date('1964-05-21'), date_of_death: new Date('2020-01-01') },
        { first_name: 'John', family_name: 'Smith', date_of_birth: new Date('1989-01-09') },
        { first_name: 'Jane', family_name: 'Smith', date_of_birth: new Date('1992-12-27') }
    ];

    beforeAll(() => {
        Author.countDocuments = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test('should return the count of all authors if no filter is provided', async () => {
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(authors.length);
        const count = await Author.getAuthorCount();
        expect(authors.length).toBe(count);
    });

    test('should return the count of authors based on first name filter', async () => {
        const expected = authors.filter(author => author.first_name === 'John').length;
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(2);
        const count = await Author.getAuthorCount({ first_name: 'John' });
        expect(expected).toBe(count);
    });

    test('should return the count of authors based on family name filter', async () => {
        const expected = authors.filter(author => author.family_name === 'Smith').length;
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(2);
        const count = await Author.getAuthorCount({ family_name: 'Smith' });
        expect(expected).toBe(count);
    });

    test('should return the count of authors based on first name and date of birth filter', async () => {
        const expected = authors.filter(author => author.first_name === 'Jane' && author.date_of_birth === authors[1].date_of_birth).length;
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(1);
        const count = await Author.getAuthorCount({ first_name: 'Jane', date_of_birth: authors[1].date_of_birth });
        expect(expected).toBe(count);
    });

    test('should return the count of authors based on family name and date of birth filter', async () => {
        const expected = authors.filter(author => author.family_name === 'Smith' && author.date_of_birth === authors[2].date_of_birth).length;
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(1);
        const count = await Author.getAuthorCount({ family_name: 'Smith', date_of_birth: authors[2].date_of_birth });
        expect(expected).toBe(count);
    });

    test('should return the count of authors with known death date filter', async () => {
        const expected = authors.filter(author => author.date_of_death).length;
        (Author.countDocuments as jest.Mock).mockResolvedValueOnce(2);
        const count = await Author.getAuthorCount({ date_of_death: { $exists: true } });
        expect(expected).toBe(count);
    });
});