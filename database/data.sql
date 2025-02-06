insert into "tournaments" ("name","address","days","games","hours","lat","lng")
  values ('Riverside Game Labs Mega Monthly',
         '3633 Market St, Riverside, CA 92501',
         'Sat Sun',
         'UNI2 SF6',
         '2PM 11PM',
         '33.9842159',
         '-117.3752006'),
         ('Anime Fight Night',
         '137 N Victory Blvd, Burbank, CA 91502',
         'Fri',
         '',
         '6PM 11PM',
         '34.17463900000001',
          '-118.317247')
returning *;

insert into "socialMedia" ("tournamentId","platform","link")
  values('1','twitter','https://x.com/PlusFramesGG')
returning *;

insert into "users" ("username", "hashedPassword")
  values('abraham', 'password')
returning *;

insert into "editPerms" ("createdBy", "tournamentId")
  values('abraham','1')
returning *;
