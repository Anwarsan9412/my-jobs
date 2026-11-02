[33mcommit 0b5de8a1be8e14c4123a3dad0248ff7ea17df81c[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: Anwarsan9412 <anwarsanusi9412@gmail.com>
Date:   Mon Nov 2 14:20:47 2026 +0700

    fix: tambah Link Intransit

 src/App.js                         |   8 [32m++[m
 src/components/Header.jsx          |   6 [32m+[m[31m-[m
 src/components/IntransitList.jsx   | 147 [32m++++++++++++++++++++++++++[m[31m-----------[m
 src/components/pages/About.jsx     |   2 [32m+[m[31m-[m
 src/components/pages/Intransit.jsx |  17 [32m+++++[m
 5 files changed, 135 insertions(+), 45 deletions(-)

[33mcommit ba36de1d1fbe3f4736c5c05381ab9e95b6bc6cef[m
Author: Anwarsan9412 <anwarsanusi9412@gmail.com>
Date:   Mon Nov 2 11:18:05 2026 +0700

    fix : penambahan Link

 package-lock.json              | 58 [32m+++++++++++++++++++++++++++++++++++[m
 package.json                   |  1 [32m+[m
 src/App.js                     | 68 [32m+++++++++++++[m[31m-----------------------------[m
 src/components/Header.jsx      | 46 [32m++++++++++++++++++++++++++++[m
 src/components/pages/About.jsx | 12 [32m++++++++[m
 src/components/pages/Home.jsx  | 19 [32m++++++++++++[m
 src/index.js                   |  5 [32m++[m[31m--[m
 start.bat                      | 13 [32m++++++++[m
 8 files changed, 173 insertions(+), 49 deletions(-)

[33mcommit ffecd0b1033ad8a9bb65eb2749528ba62564a2a6[m
Author: Anwarsan9412 <anwarsanusi9412@gmail.com>
Date:   Sun Nov 1 16:28:38 2026 +0700

    fix: upload csvKeter blank

 backend/server.js                                | 163 [32m++++++++++++++++++[m[31m-----[m
 backend/uploads/078fcfdc8c36ba8496a4da2a21b4297b |   2 [32m+[m
 backend/uploads/0d03156fe1717db6cdd493fe587f4224 |   7 [32m+[m
 backend/uploads/2e04178d5602161a26eff3bd71c94bae |   7 [32m+[m
 backend/uploads/336405a8fec1048dc7c78cfaa5448397 |   2 [32m+[m
 backend/uploads/775ab6882572ab5980378e16e69951d8 |   2 [32m+[m
 backend/uploads/845771acc0bd1310a5f719f2e774ad14 |   7 [32m+[m
 backend/uploads/a4d0e9c51f0fb04cd52a9d6d81977859 |   7 [32m+[m
 backend/uploads/f491307a4d886667ae210457ee0429ba |   7 [32m+[m
 backend/uploads/ffa1c68811cb18f62d245782002aba9f |   2 [32m+[m
 package-lock.json                                | 106 [32m++++++++++++++[m[31m-[m
 package.json                                     |   3 [32m+[m[31m-[m
 src/App.js                                       |  12 [32m+[m[31m-[m
 src/components/Coba.jsx                          |   6 [32m+[m
 src/components/IntransitExportToExcel.jsx        |  32 [32m+++++[m
 src/hooks/useIntransits.js                       |  42 [32m+++++[m[31m-[m
 16 files changed, 367 insertions(+), 40 deletions(-)

[33mcommit d065f945d62f544ec26adf88c5abc7d3e4c379dc[m
Author: Anwarsan9412 <anwarsanusi9412@gmail.com>
Date:   Sun Oct 25 16:29:16 2026 +0700

    fix: list box

 src/App.js                            | 39 [32m++++++++++++++++++[m[31m-----------------[m
 src/components/IntransitListFinal.jsx | 10 [32m++++++[m[31m---[m
 2 files changed, 27 insertions(+), 22 deletions(-)

[33mcommit 41ae7512e5b5630f2bdf0abdeb7ae439818ab63b[m
Author: Anwarsan9412 <anwarsanusi9412@gmail.com>
Date:   Sun Oct 25 15:53:04 2026 +0700

    feat: intransit app modal popup done

 .babelrc                              |    6 [32m+[m
 .gitignore                            |   12 [32m+[m
 backend/package-lock.json             |  996 [32m+++++[m
 backend/package.json                  |   16 [32m+[m
 backend/server.js                     |  138 [32m+[m
 package-lock.json                     | 6484 [32m+++++++++++++++++++++++++++++++++[m
 package.json                          |   28 [32m+[m
 src/App.js                            |   52 [32m+[m
 src/components/IntransitForm.jsx      |   54 [32m+[m
 src/components/IntransitList.jsx      |   41 [32m+[m
 src/components/IntransitListFinal.jsx |   83 [32m+[m
 src/components/IntransitUpload.jsx    |   93 [32m+[m
 src/hooks/useIntransits.js            |   80 [32m+[m
 src/index.css                         |   12 [32m+[m
 src/index.js                          |   13 [32m+[m
 src/services/intransitServices.js     |   17 [32m+[m
 webpack.config.js                     |   43 [32m+[m
 17 files changed, 8168 insertions(+)
