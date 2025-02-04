insert into "tournaments" ("name","address","days","hours")
  values ('Riverside Game Labs Mega Monthly',
         '3633 Market St, Riverside, CA 92501',
         'Sat Sun',
         '2PM 11PM'),
         ('Anime Fight Night',
         '137 N Victory Blvd, Burbank, CA 91502',
         'Fri',
         '6PM 11PM')
returning *;

insert into "games" ("tournamentId","name")
  values ('1','UNI2')
returning *;

insert into "socialMedia" ("tournamentId","platform","link")
  values('1','twitter','https://x.com/PlusFramesGG')
returning *;

insert into "editPerms" ("createdBy", "tournamentId")
  values('abraham','1')
returning *;

insert into "users" ("username", "hashedPassword")
  values('abraham', 'password')
returning *;
