import mysql from 'mysql2/promise';

interface Book {
  title: string;
  author: string;
  genre: string;
  cover: string;
  color: string;
}

const books: Book[] = [
  // Classic Literature (15 books)
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', cover: 'https://placehold.co/150x200/FF6347/FFFFFF?text=1984', color: '#FF6347' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', cover: 'https://placehold.co/150x200/4682B4/FFFFFF?text=Gatsby', color: '#4682B4' },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', cover: 'https://placehold.co/150x200/32CD32/FFFFFF?text=Brave', color: '#32CD32' },
  { title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure', cover: 'https://placehold.co/150x200/FFD700/FFFFFF?text=Moby', color: '#FFD700' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', cover: 'https://placehold.co/150x200/6A5ACD/FFFFFF?text=Mockingbird', color: '#6A5ACD' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', cover: 'https://placehold.co/150x200/DA70D6/FFFFFF?text=Pride', color: '#DA70D6' },
  { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Historical', cover: 'https://placehold.co/150x200/778899/FFFFFF?text=WarPeace', color: '#778899' },
  { title: 'Anna Karenina', author: 'Leo Tolstoy', genre: 'Classic', cover: 'https://placehold.co/150x200/CD5C5C/FFFFFF?text=Anna', color: '#CD5C5C' },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic', cover: 'https://placehold.co/150x200/4B0082/FFFFFF?text=Crime', color: '#4B0082' },
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', genre: 'Classic', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=Brothers', color: '#2F4F4F' },
  { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Classic', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=Wuthering', color: '#8B4513' },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Classic', cover: 'https://placehold.co/150x200/A0522D/FFFFFF?text=JaneEyre', color: '#A0522D' },
  { title: 'Great Expectations', author: 'Charles Dickens', genre: 'Classic', cover: 'https://placehold.co/150x200/556B2F/FFFFFF?text=Expectations', color: '#556B2F' },
  { title: 'Oliver Twist', author: 'Charles Dickens', genre: 'Classic', cover: 'https://placehold.co/150x200/6B8E23/FFFFFF?text=Oliver', color: '#6B8E23' },
  { title: 'A Tale of Two Cities', author: 'Charles Dickens', genre: 'Historical', cover: 'https://placehold.co/150x200/708090/FFFFFF?text=TwoCities', color: '#708090' },

  // Fantasy (20 books)
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', cover: 'https://placehold.co/150x200/20B2AA/FFFFFF?text=Hobbit', color: '#20B2AA' },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=LOTR', color: '#8B4513' },
  { title: 'The Silmarillion', author: 'J.R.R. Tolkien', genre: 'Fantasy', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=Silmarillion', color: '#2F4F4F' },
  { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', genre: 'Fantasy', cover: 'https://placehold.co/150x200/556B2F/FFFFFF?text=Narnia', color: '#556B2F' },
  { title: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll', genre: 'Fantasy', cover: 'https://placehold.co/150x200/9932CC/FFFFFF?text=Alice', color: '#9932CC' },
  { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=HarryPotter', color: '#DC143C' },
  { title: 'Harry Potter and the Chamber of Secrets', author: 'J.K. Rowling', genre: 'Fantasy', cover: 'https://placehold.co/150x200/32CD32/FFFFFF?text=HP2', color: '#32CD32' },
  { title: 'Harry Potter and the Prisoner of Azkaban', author: 'J.K. Rowling', genre: 'Fantasy', cover: 'https://placehold.co/150x200/FFD700/FFFFFF?text=HP3', color: '#FFD700' },
  { title: 'A Game of Thrones', author: 'George R.R. Martin', genre: 'Fantasy', cover: 'https://placehold.co/150x200/696969/FFFFFF?text=GoT', color: '#696969' },
  { title: 'A Clash of Kings', author: 'George R.R. Martin', genre: 'Fantasy', cover: 'https://placehold.co/150x200/B8860B/FFFFFF?text=ClashKings', color: '#B8860B' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', cover: 'https://placehold.co/150x200/8B0000/FFFFFF?text=NameWind', color: '#8B0000' },
  { title: 'The Wise Man\'s Fear', author: 'Patrick Rothfuss', genre: 'Fantasy', cover: 'https://placehold.co/150x200/006400/FFFFFF?text=WiseManFear', color: '#006400' },
  { title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy', cover: 'https://placehold.co/150x200/4169E1/FFFFFF?text=WayKings', color: '#4169E1' },
  { title: 'Words of Radiance', author: 'Brandon Sanderson', genre: 'Fantasy', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=Radiance', color: '#DC143C' },
  { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', genre: 'Fantasy', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=Mistborn', color: '#2F4F4F' },
  { title: 'The Eye of the World', author: 'Robert Jordan', genre: 'Fantasy', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=EyeWorld', color: '#8B4513' },
  { title: 'Elantris', author: 'Brandon Sanderson', genre: 'Fantasy', cover: 'https://placehold.co/150x200/FF69B4/FFFFFF?text=Elantris', color: '#FF69B4' },
  { title: 'The Final Empire', author: 'Brandon Sanderson', genre: 'Fantasy', cover: 'https://placehold.co/150x200/8B008B/FFFFFF?text=FinalEmpire', color: '#8B008B' },
  { title: 'The Blade Itself', author: 'Joe Abercrombie', genre: 'Fantasy', cover: 'https://placehold.co/150x200/A52A2A/FFFFFF?text=BladeItself', color: '#A52A2A' },
  { title: 'The Lies of Locke Lamora', author: 'Scott Lynch', genre: 'Fantasy', cover: 'https://placehold.co/150x200/800080/FFFFFF?text=LockeLamora', color: '#800080' },

  // Science Fiction (25 books)
  { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/4B0082/FFFFFF?text=Hitchhiker', color: '#4B0082' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/800000/FFFFFF?text=Martian', color: '#800000' },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/BDB76B/FFFFFF?text=Dune', color: '#BDB76B' },
  { title: 'Dune Messiah', author: 'Frank Herbert', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/DAA520/FFFFFF?text=DuneMessiah', color: '#DAA520' },
  { title: 'Children of Dune', author: 'Frank Herbert', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/F4A460/FFFFFF?text=ChildrenDune', color: '#F4A460' },
  { title: 'Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/008B8B/FFFFFF?text=Foundation', color: '#008B8B' },
  { title: 'Foundation and Empire', author: 'Isaac Asimov', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/20B2AA/FFFFFF?text=FoundationEmpire', color: '#20B2AA' },
  { title: 'Second Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/48D1CC/FFFFFF?text=SecondFoundation', color: '#48D1CC' },
  { title: 'Neuromancer', author: 'William Gibson', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/000080/FFFFFF?text=Neuromancer', color: '#000080' },
  { title: 'Snow Crash', author: 'Neal Stephenson', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/808080/FFFFFF?text=SnowCrash', color: '#808080' },
  { title: 'The Martian Chronicles', author: 'Ray Bradbury', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/E9967A/FFFFFF?text=MartianChronicles', color: '#E9967A' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian', cover: 'https://placehold.co/150x200/B22222/FFFFFF?text=F451', color: '#B22222' },
  { title: 'I, Robot', author: 'Isaac Asimov', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/8FBC8F/FFFFFF?text=IRobot', color: '#8FBC8F' },
  { title: 'Do Androids Dream of Electric Sheep?', author: 'Philip K. Dick', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/483D8B/FFFFFF?text=Androids', color: '#483D8B' },
  { title: 'A Scanner Darkly', author: 'Philip K. Dick', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=ScannerDarkly', color: '#2F4F4F' },
  { title: 'VALIS', author: 'Philip K. Dick', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/00CED1/FFFFFF?text=VALIS', color: '#00CED1' },
  { title: 'Ubik', author: 'Philip K. Dick', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/9400D3/FFFFFF?text=Ubik', color: '#9400D3' },
  { title: 'The Man in the High Castle', author: 'Philip K. Dick', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/8B008B/FFFFFF?text=HighCastle', color: '#8B008B' },
  { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/4682B4/FFFFFF?text=EndersGame', color: '#4682B4' },
  { title: 'Speaker for the Dead', author: 'Orson Scott Card', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/5F9EA0/FFFFFF?text=Speaker', color: '#5F9EA0' },
  { title: 'Hyperion', author: 'Dan Simmons', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/DAA520/FFFFFF?text=Hyperion', color: '#DAA520' },
  { title: 'The Fall of Hyperion', author: 'Dan Simmons', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/B8860B/FFFFFF?text=FallHyperion', color: '#B8860B' },
  { title: 'Rendezvous with Rama', author: 'Arthur C. Clarke', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/696969/FFFFFF?text=Rama', color: '#696969' },
  { title: '2001: A Space Odyssey', author: 'Arthur C. Clarke', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/000000/FFFFFF?text=2001', color: '#000000' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', genre: 'Sci-Fi', cover: 'https://placehold.co/150x200/B0C4DE/FFFFFF?text=LeftHand', color: '#B0C4DE' },

  // Horror & Thriller (20 books)
  { title: 'The Stand', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/FF0000/FFFFFF?text=TheStand', color: '#FF0000' },
  { title: 'It', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/FF69B4/FFFFFF?text=It', color: '#FF69B4' },
  { title: 'The Shining', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/FFFF00/000000?text=Shining', color: '#FFFF00' },
  { title: 'Pet Sematary', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=PetSematary', color: '#8B4513' },
  { title: 'Misery', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=Misery', color: '#DC143C' },
  { title: 'Carrie', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/FF1493/FFFFFF?text=Carrie', color: '#FF1493' },
  { title: 'Dracula', author: 'Bram Stoker', genre: 'Horror', cover: 'https://placehold.co/150x200/8A2BE2/FFFFFF?text=Dracula', color: '#8A2BE2' },
  { title: 'Frankenstein', author: 'Mary Shelley', genre: 'Horror', cover: 'https://placehold.co/150x200/7FFF00/000000?text=Frankenstein', color: '#7FFF00' },
  { title: 'The Haunting of Hill House', author: 'Shirley Jackson', genre: 'Horror', cover: 'https://placehold.co/150x200/D2691E/FFFFFF?text=HillHouse', color: '#D2691E' },
  { title: 'The Exorcist', author: 'William Peter Blatty', genre: 'Horror', cover: 'https://placehold.co/150x200/000000/FFFFFF?text=Exorcist', color: '#000000' },
  { title: 'The Silence of the Lambs', author: 'Thomas Harris', genre: 'Thriller', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=Lambs', color: '#DC143C' },
  { title: 'Red Dragon', author: 'Thomas Harris', genre: 'Thriller', cover: 'https://placehold.co/150x200/8B0000/FFFFFF?text=RedDragon', color: '#8B0000' },
  { title: 'Hannibal', author: 'Thomas Harris', genre: 'Thriller', cover: 'https://placehold.co/150x200/A52A2A/FFFFFF?text=Hannibal', color: '#A52A2A' },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', cover: 'https://placehold.co/150x200/00FFFF/000000?text=GoneGirl', color: '#00FFFF' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Thriller', cover: 'https://placehold.co/150x200/0000FF/FFFFFF?text=DragonTattoo', color: '#0000FF' },
  { title: 'The Girl Who Played with Fire', author: 'Stieg Larsson', genre: 'Thriller', cover: 'https://placehold.co/150x200/FF4500/FFFFFF?text=PlayedFire', color: '#FF4500' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Thriller', cover: 'https://placehold.co/150x200/A52A2A/FFFFFF?text=DaVinci', color: '#A52A2A' },
  { title: 'Angels & Demons', author: 'Dan Brown', genre: 'Thriller', cover: 'https://placehold.co/150x200/696969/FFFFFF?text=AngelDemons', color: '#696969' },
  { title: 'The Shining', author: 'Stephen King', genre: 'Horror', cover: 'https://placehold.co/150x200/FFD700/000000?text=Shining2', color: '#FFD700' },
  { title: 'American Psycho', author: 'Bret Easton Ellis', genre: 'Thriller', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=AmericanPsycho', color: '#2F4F4F' },

  // Young Adult & Contemporary (15 books)
  { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'YA', cover: 'https://placehold.co/150x200/5F9EA0/FFFFFF?text=HungerGames', color: '#5F9EA0' },
  { title: 'Catching Fire', author: 'Suzanne Collins', genre: 'YA', cover: 'https://placehold.co/150x200/FF4500/FFFFFF?text=CatchingFire', color: '#FF4500' },
  { title: 'Mockingjay', author: 'Suzanne Collins', genre: 'YA', cover: 'https://placehold.co/150x200/708090/FFFFFF?text=Mockingjay', color: '#708090' },
  { title: 'The Fault in Our Stars', author: 'John Green', genre: 'YA', cover: 'https://placehold.co/150x200/FF7F50/FFFFFF?text=FaultInOurStars', color: '#FF7F50' },
  { title: 'Looking for Alaska', author: 'John Green', genre: 'YA', cover: 'https://placehold.co/150x200/4682B4/FFFFFF?text=Alaska', color: '#4682B4' },
  { title: 'Paper Towns', author: 'John Green', genre: 'YA', cover: 'https://placehold.co/150x200/32CD32/FFFFFF?text=PaperTowns', color: '#32CD32' },
  { title: 'The Giver', author: 'Lois Lowry', genre: 'YA', cover: 'https://placehold.co/150x200/FF8C00/FFFFFF?text=Giver', color: '#FF8C00' },
  { title: 'The Maze Runner', author: 'James Dashner', genre: 'YA', cover: 'https://placehold.co/150x200/9932CC/FFFFFF?text=MazeRunner', color: '#9932CC' },
  { title: 'Divergent', author: 'Veronica Roth', genre: 'YA', cover: 'https://placehold.co/150x200/8B0000/FFFFFF?text=Divergent', color: '#8B0000' },
  { title: 'Insurgent', author: 'Veronica Roth', genre: 'YA', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=Insurgent', color: '#DC143C' },
  { title: 'Allegiant', author: 'Veronica Roth', genre: 'YA', cover: 'https://placehold.co/150x200/B22222/FFFFFF?text=Allegiant', color: '#B22222' },
  { title: 'Twilight', author: 'Stephenie Meyer', genre: 'YA', cover: 'https://placehold.co/150x200/8B008B/FFFFFF?text=Twilight', color: '#8B008B' },
  { title: 'The Perks of Being a Wallflower', author: 'Stephen Chbosky', genre: 'YA', cover: 'https://placehold.co/150x200/6A5ACD/FFFFFF?text=Wallflower', color: '#6A5ACD' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', cover: 'https://placehold.co/150x200/FF4500/FFFFFF?text=Catcher', color: '#FF4500' },
  { title: 'Thirteen Reasons Why', author: 'Jay Asher', genre: 'YA', cover: 'https://placehold.co/150x200/2F4F4F/FFFFFF?text=13Reasons', color: '#2F4F4F' },

  // Historical & Literary Fiction (20 books)
  { title: 'The Book Thief', author: 'Markus Zusak', genre: 'Historical', cover: 'https://placehold.co/150x200/6495ED/FFFFFF?text=BookThief', color: '#6495ED' },
  { title: 'All the Light We Cannot See', author: 'Anthony Doerr', genre: 'Historical', cover: 'https://placehold.co/150x200/F5DEB3/000000?text=AllTheLight', color: '#F5DEB3' },
  { title: 'The Help', author: 'Kathryn Stockett', genre: 'Historical', cover: 'https://placehold.co/150x200/008B8B/FFFFFF?text=TheHelp', color: '#008B8B' },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'Fiction', cover: 'https://placehold.co/150x200/B8860B/FFFFFF?text=KiteRunner', color: '#B8860B' },
  { title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', genre: 'Fiction', cover: 'https://placehold.co/150x200/A9A9A9/FFFFFF?text=SplendidSuns', color: '#A9A9A9' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', cover: 'https://placehold.co/150x200/006400/FFFFFF?text=Alchemist', color: '#006400' },
  { title: 'Life of Pi', author: 'Yann Martel', genre: 'Fiction', cover: 'https://placehold.co/150x200/BDB76B/FFFFFF?text=LifeOfPi', color: '#BDB76B' },
  { title: 'The Road', author: 'Cormac McCarthy', genre: 'Dystopian', cover: 'https://placehold.co/150x200/8B008B/FFFFFF?text=TheRoad', color: '#8B008B' },
  { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', genre: 'Dystopian', cover: 'https://placehold.co/150x200/556B2F/FFFFFF?text=Handmaid', color: '#556B2F' },
  { title: 'Beloved', author: 'Toni Morrison', genre: 'Fiction', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=Beloved', color: '#8B4513' },
  { title: 'The Color Purple', author: 'Alice Walker', genre: 'Fiction', cover: 'https://placehold.co/150x200/9370DB/FFFFFF?text=ColorPurple', color: '#9370DB' },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', genre: 'Fiction', cover: 'https://placehold.co/150x200/DAA520/FFFFFF?text=100Years', color: '#DAA520' },
  { title: 'Love in the Time of Cholera', author: 'Gabriel García Márquez', genre: 'Fiction', cover: 'https://placehold.co/150x200/DC143C/FFFFFF?text=LoveCholera', color: '#DC143C' },
  { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', genre: 'Fiction', cover: 'https://placehold.co/150x200/4682B4/FFFFFF?text=OldManSea', color: '#4682B4' },
  { title: 'For Whom the Bell Tolls', author: 'Ernest Hemingway', genre: 'Fiction', cover: 'https://placehold.co/150x200/8B0000/FFFFFF?text=BellTolls', color: '#8B0000' },
  { title: 'The Sun Also Rises', author: 'Ernest Hemingway', genre: 'Fiction', cover: 'https://placehold.co/150x200/FFD700/FFFFFF?text=SunRises', color: '#FFD700' },
  { title: 'Catch-22', author: 'Joseph Heller', genre: 'Fiction', cover: 'https://placehold.co/150x200/556B2F/FFFFFF?text=Catch22', color: '#556B2F' },
  { title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', genre: 'Fiction', cover: 'https://placehold.co/150x200/708090/FFFFFF?text=Slaughterhouse', color: '#708090' },
  { title: 'The Bell Jar', author: 'Sylvia Plath', genre: 'Fiction', cover: 'https://placehold.co/150x200/FF69B4/FFFFFF?text=BellJar', color: '#FF69B4' },
  { title: 'The Grapes of Wrath', author: 'John Steinbeck', genre: 'Fiction', cover: 'https://placehold.co/150x200/8B4513/FFFFFF?text=GrapesWrath', color: '#8B4513' },
];

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'bookshelf',
    password: process.env.DB_PASSWORD || 'bookshelf',
    database: process.env.DB_NAME || 'bookshelf',
  });

  try {
    console.log('Connected to MySQL database');

    // Clear existing data
    await connection.query('DELETE FROM books');
    console.log('✅ Cleared existing books');

    // Insert books
    const insertQuery = `
      INSERT INTO books (title, author, genre, cover, color)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const book of books) {
      await connection.query(insertQuery, [
        book.title,
        book.author,
        book.genre,
        book.cover,
        book.color,
      ]);
    }

    console.log(`✅ Successfully seeded ${books.length} books into the database`);

    // Show summary
    const [genres] = await connection.query<any[]>(
      'SELECT genre, COUNT(*) as count FROM books GROUP BY genre ORDER BY count DESC'
    );
    console.log('\n📚 Books by genre:');
    (genres as any[]).forEach((row: any) => {
      console.log(`  ${row.genre}: ${row.count} books`);
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase();
