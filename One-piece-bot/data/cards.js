    const cards = [
      {
        name: "Monkey D. Luffy",
        rank: "C",
        power: 25,
        health: 300,
        speed: 120,
        image: "https://files.catbox.moe/trvkkl.png"
      },
      {
        name: "Luffy (gear 2nd) II",
        rank: "B",
        power: 42,
        health: 380,
        speed: 160,
        image: "https://files.catbox.moe/nadi6c.webp",
        evolvesFrom: "Monkey D. Luffy"
      },
      {
        name: "Sun god Nika III",
        rank: "UR",
        power: 100,
        health: 800,
        speed: 250,
        image: "https://files.catbox.moe/570aig.png",
        evolvesFrom: "Luffy (gear 2nd) II"
      },
      {
        name: "Roronoa Zoro",
        rank: "C",
        power: 22,
        health: 300,
        speed: 100,
        image: "https://files.catbox.moe/wful4s.png"
      },
      {
        name: "Roronoa Zoro II",
        rank: "B",
        power: 38,
        health: 360,
        speed: 120,
        image: "https://files.catbox.moe/z8dddt.png",
        evolvesFrom: "Roronoa Zoro"
      },
      {
        name: "Roronoa Zoro III",
        rank: "S",
        power: 80,
        health: 650,
        speed: 170,
        image: "https://files.catbox.moe/8pcmol.jpg",
        evolvesFrom: "https://files.catbox.moe/tqsyl8.png"
      },
      {
        name: "Usopp",
        rank: "C",
        power: 16,
        health: 200,
        speed: 70,
        image: "https://files.catbox.moe/yunhpa.png"
      },
      {
        name: "Usopp II",
        rank: "B",
        power: 30,
        health: 350,
        speed: 100,
        image: "https://files.catbox.moe/gk4izt.png",
        evolvesFrom: "Usopp"
      },
      {
        name: " Usopp God III",
        rank: "A",
        power: 50,
        health: 420,
        speed: 140,
        image: "https://files.catbox.moe/k37xrp.png",
        evolvesFrom: "Usopp II"
      },
      {
        name: "Captain Kuro",
        rank: "C",
        power: 14,
        health: 180,
        speed: 90,
        image: "https://files.catbox.moe/z1nds8.png"
      },
      {
        name: "Vinsmoke Sanji",
        rank: "C",
        power: 24,
        health: 270,
        speed: 130,
        image: "https://files.catbox.moe/h0r52x.png"
      },
      {
        name: "Vinsmoke Sanji II",
        rank: "B",
        power: 39,
        health: 340,
        speed: 150,
        image: "https://files.catbox.moe/21cyze.png",
        evolvesFrom: "Vinsmoke Sanji"
      },
      {
        name: "Vinsmoke Sanji III",
        rank: "S",
        power: 70,
        health: 550,
        speed: 200,
        image: "https://files.catbox.moe/o0a0h2.png",
        evolvesFrom: "Vinsmoke Sanji II"
      },
      {
        name: "Zeff",
        rank: "C",
        power: 18,
        health: 250,
        speed: 60,
        image: "https://files.catbox.moe/rtoght.png"
      },
      {
        name: "Nami",
        rank: "C",
        power: 15,
        health: 200,
        speed: 100,
        image: "https://files.catbox.moe/cjwf0y.png"
      },
      {
        name: "Nami II",
        rank: "B",
        power: 30,
        health: 260,
        speed: 130,
        image: "https://files.catbox.moe/cqk5vm.png",
        evolvesFrom: "Nami"
      },
      {
        name: "Arlong",
        rank: "C",
        power: 26,
        health: 320,
        speed: 90,
        image: "https://files.catbox.moe/hzvoxf.png"
      },
      {
        name: "Smoker",
        rank: "B",
        power: 35,
        health: 400,
        speed: 120,
        image: "https://files.catbox.moe/n9h10u.png",
      },
      {
        name: "Smoker II",
        rank: "S",
        power: 65,
        health: 700,
        speed: 130,
        image: "https://files.catbox.moe/0s7ade.png",
        evolvesFrom: "Smoker"
      },
      {
        name: "Tashigi",
        rank: "C",
        power: 22,
        health: 250,
        speed: 110,
        image: "https://files.catbox.moe/xr7f17.png"
      },
      {
        name: "Tashigi II",
        rank: "A",
        power: 45,
        health: 470,
        speed: 120,
        image: "https://files.catbox.moe/7mvg1p.png",
        evolvesFrom: "Tashigi"
      },
      {
        name: "Nico Robin",
        rank: "B",
        power: 34,
        health: 280,
        speed: 100,
        image: "https://files.catbox.moe/wkow7c.png"
      },
      {
        name: "Nico Robin II",
        rank: "A",
        power: 48,
        health: 360,
        speed: 120,
        image: "https://files.catbox.moe/coqruj.png",
        evolvesFrom: "Nico Robin"
      },
      {
        name: "Nico Robin III",
        rank: "S",
        power: 70,
        health: 550,
        speed: 150,
        image: "https://files.catbox.moe/d50dwu.png",
        evolvesFrom: "Nico Robin II"
      },
      {
        name: "Crocodile",
        rank: "A",
        power: 50,
        health: 450,
        speed: 100,
        image: "https://files.catbox.moe/l9djm2.png"
      },
      {
        name: "Crocodile II",
        rank: "S",
        power: 72,
        health: 600,
        speed: 120,
        image: "https://files.catbox.moe/hn193y.png",
        evolvesFrom: "Crocodile"
      },
  {
    name: "Chopper",
    rank: "C",
    power: 18,
    health: 250,
    speed: 90,
    image: "https://files.catbox.moe/tqk21p.png",
  },
  {
    name: "Chopper Heavy Point II",
    rank: "B",
    power: 32,
    health: 340,
    speed: 100,
    image: "https://files.catbox.moe/ak4l9o.png",
    evolvesFrom: "Chopper",
  },
  {
    name: "Chopper Monster Point III",
    rank: "A",
    power: 52,
    health: 460,
    speed: 110,
    image: "https://files.catbox.moe/66qkxp.png",
    evolvesFrom: "Chopper Heavy Point II",
  },
  {
    name: "Daz bonez (Mr.1)",
    rank: "B",
    power: 32,
    health: 340,
    speed: 90,
    image: "https://files.catbox.moe/xis0g5.png",
  },
  {
    name: "Miss Doublefinger",
    rank: "C",
    power: 180,
    health: 210,
    speed: 90,
    image: "https://files.catbox.moe/9y1h8r.png",
  },
  {
    name: "Bon Clay (Mr.2)",
    rank: "C",
    power: 24,
    health: 260,
    speed: 100,
    image: "https://files.catbox.moe/vttjyy.png",
  },
  {
    name: "Galdino (Mr.3)",
    rank: "C",
    power: 20,
    health: 230,
    speed: 80,
    image: "https://files.catbox.moe/axk1pl.png",
  },
  {
    name: "Pell",
    rank: "C",
    power: 27,
    health: 300,
    speed: 110,
    image: "https://files.catbox.moe/2tgysb.png",
  },
  {
    name: "Chaka",
    rank: "C",
    power: 26,
    health: 280,
    speed: 100,
    image: "https://files.catbox.moe/1p4xpo.png",
  },
  {
    name: "Igaram",
    rank: "C",
    power: 16,
    health: 220,
    speed: 70,
    image: "https://files.catbox.moe/jx4v9s.png",
  },
  {
    name: "Enel",
    rank: "A",
    power: 52,
    health: 460,
    speed: 150,
    image: "https://files.catbox.moe/9ybn9s.png",
  },
  {
    name: "Wyper",
    rank: "C",
    power: 24,
    health: 260,
    speed: 100,
    image: "https://files.catbox.moe/hkw3mk.png",
  },
  {
    name: "Gan Fall",
    rank: "C",
    power: 20,
    health: 240,
    speed: 90,
    image: "https://files.catbox.moe/a15qha.png",
  },
  {
    name: "Ohm",
    rank: "C",
    power: 23,
    health: 250,
    speed: 100,
    image: "https://files.catbox.moe/jthe24.png", 
  },
  {
    name: "Shura",
    rank: "C",
    power: 22,
    health: 240,
    speed: 100,
    image: "https://files.catbox.moe/zoamtl.png",
  },
  {
    name: "Gedatsu",
    rank: "C",
    power: 21,
    health: 230,
    speed: 90,
    image: "https://files.catbox.moe/a2lxuz.png",
  },
  {
    name: "Satori",
    rank: "C",
    power: 20,
    health: 210,
    speed: 80,
    image: "https://files.catbox.moe/zu39w3.png",
  },
  {
    name: "Aisa",
    rank: "C",
    power: 10,
    health: 140,
    speed: 110,
    image: "https://files.catbox.moe/m82x98.png",
  },
  {
    name: "Franky",
    rank: "B",
    power: 36,
    health: 320,
    speed: 100,
    image: "https://files.catbox.moe/c204to.png",
  },
  {
    name: "Franky II",
    rank: "A",
    power: 54,
    health: 480,
    speed: 110,
    image: "https://files.catbox.moe/1yufc7.webp",
    evolvesFrom: "Franky",
  },
  {
    name: "Franky III",
    rank: "S",
    power: 70,
    health: 580,
    speed: 120,
    image: "https://files.catbox.moe/e3i4m6.jpg",
    evolvesFrom: "Franky II",
  },
  {
    name: "Rob Lucci",
    rank: "A",
    power: 52,
    health: 450,
    speed: 130,
    image: "https://files.catbox.moe/nykxw3.webp",
  },
  {
    name: "Rob Lucci II",
    rank: "S",
    power: 70,
    health: 540,
    speed: 150,
    image: "https://files.catbox.moe/2r08gt.png",
    evolvesFrom: "Rob Lucci",
  },
  {
    name: " Lucci Awakened Zoan III",
    rank: "SS",
    power: 85,
    health: 620,
    speed: 170,
    image: "https://files.catbox.moe/t4r0qv.jpg",
    evolvesFrom: "Rob Lucci II",
  },


  {
    name: "Kaku",
    rank: "B",
    power: 34,
    health: 320,
    speed: 120,
    image: "https://files.catbox.moe/mykcr6.webp"
  },
  {
    name: "Kaku II",
    rank: "A",
    power: 46,
    health: 420,
    speed: 130,
    image: "https://files.catbox.moe/snkxi8.webp",
    evolvesFrom: "Kaku"
  },
  {
    name: "Kaku Awakened Zoan III",
    rank: "S",
    power: 64,
    health: 500,
    speed: 150,
    image: "https://files.catbox.moe/f5ansl.jpg",
    evolvesFrom: "Kaku II"
  },
  {
    name: "Blueno",
    rank: "B",
    power: 32,
    health: 330,
    speed: 110,
    image: "https://files.catbox.moe/u4ma2f.webp"
  },
  {
    name: "Jabra",
    rank: "B",
    power: 34,
    health: 340,
    speed: 120,
    image: "https://files.catbox.moe/wcc45p.jpg"
  },
  {
    name: "Kumadori",
    rank: "C",
    power: 26,
    health: 290,
    speed: 80,
    image: "https://files.catbox.moe/9kow8l.webp"
  },
  {
    name: "Fukuro",
    rank: "C",
    power: 25,
    health: 270,
    speed: 100,
    image: "https://files.catbox.moe/aj4yl1.webp"
  },
  {
    name: "Kalifa",
    rank: "C",
    power: 23,
    health: 240,
    speed: 100,
    image: "https://files.catbox.moe/qc1xmk.webp"
  },
  {
    name: "Spandam",
    rank: "C",
    power: 12,
    health: 180,
    speed: 60,
    image: "https://files.catbox.moe/ihqgi1.webp"
  },
  {
    name: "Paulie",
    rank: "C",
    power: 26,
    health: 280,
    speed: 90,
    image: "https://files.catbox.moe/i26vff.png"
  },
  {
    name: "Iceburg",
    rank: "C",
    power: 10,
    health: 160,
    speed: 70,
    image: "https://files.catbox.moe/tyrvp2.jpg"
  },
  {
    name: "Gecko Moria",
    rank: "A",
    power: 50,
    health: 460,
    speed: 90,
    image: "https://files.catbox.moe/rrfhb2.webp"
  },
  {
    name: "Shadow Moria II",
    rank: "S",
    power: 68,
    health: 520,
    speed: 100,
    image: "https://files.catbox.moe/e88ypm.jpg",
    evolvesFrom: "Gecko Moria"
  },
  {
    name: "Nightmare Luffy",
    rank: "S",
    power: 75,
    health: 600,
    speed: 130,
    image: "https://files.catbox.moe/ucn5ce.jpg"
  },
  {
    name: "Perona",
    rank: "B",
    power: 30,
    health: 260,
    speed: 120,
    image: "https://files.catbox.moe/wam98q.webp"
  },
  {
    name: "Perona II",
    rank: "A",
    power: 42,
    health: 350,
    speed: 140,
    image: "https://files.catbox.moe/xnrhhr.webp",
    evolvesFrom: "Perona"
  },
  {
    name: "Absalom",
    rank: "C",
    power: 28,
    health: 300,
    speed: 90,
    image: "https://files.catbox.moe/es0xet.webp"
  },
  {
    name: "Hogback",
    rank: "C",
    power: 14,
    health: 200,
    speed: 60,
    image: "https://files.catbox.moe/2vc733.webp"
  },
  {
    name: "Victoria Cindry",
    rank: "C",
    power: 24,
    health: 260,
    speed: 80,
    image: "https://files.catbox.moe/r2ooy1.webp"
  },
  {
    name: "Oars",
    rank: "A",
    power: 58,
    health: 700,
    speed: 70,
    image: "https://files.catbox.moe/l9vcyy.webp"
  },
  {
    name: "Lola",
    rank: "C",
    power: 20,
    health: 250,
    speed: 90,
    image: "https://files.catbox.moe/ieclkm.webp"
  },
  {
    name: "Trafalgar Law",
    rank: "A",
    power: 50,
    health: 460,
    speed: 120,
    image: "https://files.catbox.moe/ke83d5.webp"
  },
  {
    name: "Trafalgar Law II",
    rank: "S",
    power: 70,
    health: 540,
    speed: 140,
    image: "https://files.catbox.moe/12r5k5.webp",
    evolvesFrom: "Trafalgar Law"
  },
  {
    name: "Trafalgar Law III",
    rank: "SS",
    power: 88,
    health: 620,
    speed: 160,
    image: "https://files.catbox.moe/7x2kjk.jpg",
    evolvesFrom: "Trafalgar Law II"
  },

  {
    name: "Eustass Kid",
    rank: "A",
    power: 51,
    health: 470,
    speed: 110,
    image: "https://files.catbox.moe/b6fgyz.webp"
  },
  {
    name: "Eustass Kid II",
    rank: "S",
    power: 70,
    health: 560,
    speed: 120,
    image: "https://files.catbox.moe/dnbi55.webp",
    evolvesFrom: "Eustass Kid"
  },
  {
    name: "Eustass Kid III",
    rank: "SS",
    power: 87,
    health: 630,
    speed: 140,
    image: "https://files.catbox.moe/o62h78.jpg",
    evolvesFrom: "Eustass Kid II"
  },
  {
    name: "Killer",
    rank: "B",
    power: 36,
    health: 340,
    speed: 130,
    image: "https://files.catbox.moe/swap1h.webp"
  },
  {
    name: "Killer II",
    rank: "A",
    power: 48,
    health: 420,
    speed: 140,
    image: "https://files.catbox.moe/6bkpqn.jpg",
    evolvesFrom: "Killer"
  },
  {
    name: "X Drake",
    rank: "B",
    power: 38,
    health: 400,
    speed: 110,
    image: "https://files.catbox.moe/s1qql3.webp"
  },
  {
    name: "X drake II",
    rank: "A",
    power: 52,
    health: 540,
    speed: 135,
    image: "https://files.catbox.moe/o85pi0.jpg",
    evolvesFrom: "X drake"
  },
  {
    name: "Basil Hawkins",
    rank: "B",
    power: 37,
    health: 380,
    speed: 100,
    image: "https://files.catbox.moe/zjpukf.webp"
  },
      {
        name: "Basil Hawkins II",
        rank: "A",
        power: 51,
        health: 550,
        speed: 120,
        image: "https://files.catbox.moe/cs5d83.jpg",
        evolvesFrom: "Basil Hawkins"
      },
  {
    name: "Scratchmen Apoo",
    rank: "B",
    power: 34,
    health: 320,
    speed: 120,
    image: "https://files.catbox.moe/xc6t2i.webp"
  },
      {
        name: "Scratnchmen Apoo II",
        rank: "A",
        power: 50,
        health: 480,
        speed: 120,
        image: "https://files.catbox.moe/ztqpx9.jpg",
        evolvesFrom: "Scratchmen Apoo"
      },
  {
    name: "Urouge",
    rank: "B",
    power: 36,
    health: 420,
    speed: 90,
    image: "https://files.catbox.moe/b077p5.webp"
  },
  {
    name: "Capone Bege",
    rank: "B",
    power: 35,
    health: 380,
    speed: 90,
    image: "https://files.catbox.moe/97dnc6.webp"
  },
      {
        name: "Capone Bege II",
        rank: "A",
        power: 53,
        health: 620,
        speed: 100,
        image: "https://files.catbox.moe/qc2ldw.jpg",
        evolvesFrom: "Capone Bege"
      },
  {
    name: "Jewelry Bonney",
    rank: "B",
    power: 33,
    health: 340,
    speed: 100,
    image: "https://files.catbox.moe/m940uc.jpg"
  },
      {
        name: "Jewelry Bonney II",
        rank: "A",
        power: 49,
        health: 500,
        speed: 100,
        image: "https://files.catbox.moe/bja5kn.webp",
        evolvesFrom: "Jewelry Bonney"
      },
  {
    name: "Ursa Pacifista",
    rank: "A",
    power: 54,
    health: 600,
    speed: 80,
    image: "https://files.catbox.moe/cpx02v.webp"
  },
  {
    name: "Sentomaru",
    rank: "B",
    power: 42,
    health: 450,
    speed: 90,
    image: "https://files.catbox.moe/wnpfdy.webp"
  },
      {
        name: "Sentomaru II",
        rank: "A",
        power: 55,
        health: 580,
        speed: 100,
        image: "https://files.catbox.moe/0s5et3.webp"
      },
  {
    name: "Shakuyaku",
    rank: "C",
    power: 18,
    health: 200,
    speed: 90,
    image: "https://files.catbox.moe/f0rc09.webp"
  },
  {
    name: "Duval",
    rank: "C",
    power: 20,
    health: 250,
    speed: 80,
    image: "https://files.catbox.moe/o1iyke.webp"
  },
  {
    name: "Boa Hancock",
    rank: "A",
    power: 52,
    health: 470,
    speed: 130,
    image: "https://files.catbox.moe/2f6jle.webp"
  },
  {
    name: "Boa Hancock II",
    rank: "S",
    power: 70,
    health: 540,
    speed: 140,
    image: "https://files.catbox.moe/ds28ra.jpg",
    evolvesFrom: "Boa Hancock"
  },
      {
        name: "Emporio Ivankov",
        rank: "A",
        power: 52,
        health: 500,
        speed: 100,
        image: "https://files.catbox.moe/l46hcv.webp"
      },
      {
        name: "Inazuma",
        rank: "B",
        power: 38,
        health: 350,
        speed: 110,
        image: "https://files.catbox.moe/96lmbx.webp"
      },
      {
        name: "Hannyabal",
        rank: "B",
        power: 40,
        health: 360,
        speed: 100,
        image: "https://files.catbox.moe/r22q9y.webp"
      },
      {
        name: "Saldeath",
        rank: "C",
        power: 22,
        health: 240,
        speed: 90,
        image: "https://files.catbox.moe/jbh04f.webp"
      },
      {
        name: "Domino",
        rank: "C",
        power: 26,
        health: 280,
        speed: 100,
        image: "https://files.catbox.moe/gmiaui.webp"
      },
      {
        name: "Sadie",
        rank: "C",
        power: 23,
        health: 250,
        speed: 95,
        image: "https://files.catbox.moe/89qfy1.webp"
      },
      {
        name: "Whitebeard",
        rank: "SS",
        power: 92,
        health: 750,
        speed: 100,
        image: "https://files.catbox.moe/2h1lc8.jpg"
      },
      {
        name: "Edward Newgate II",
        rank: "UR",
        power: 100,
        health: 900,
        speed: 100,
        image: "https://files.catbox.moe/96j8i6.jpg",
        evolvesFrom: "Whitebeard"
      },
      {
        name: "Portgas D. Ace",
        rank: "S",
        power: 72,
        health: 540,
        speed: 140,
        image: "https://files.catbox.moe/ikf93i.jpg"
      },
      {
        name: "Sakazuki (Akainu)",
        rank: "SS",
        power: 90,
        health: 750,
        speed: 120,
        image: "https://files.catbox.moe/j127v6.webp"
      },
      {
        name: "Borsalino (Kizaru)",
        rank: "SS",
        power: 88,
        health: 720,
        speed: 180,
        image: "https://files.catbox.moe/bejagw.jpg"
      },
      {
        name: "Aokiji (Kuzan)",
        rank: "S",
        power: 77,
        health: 670,
        speed: 120,
        image: "https://files.catbox.moe/jsu8se.png"
      },
      {
        name: "Aokiji II",
        rank: "SS",
        power: 87,
        health: 740,
        speed: 130,
        evolvesFrom: "Aokiji (Kuzan)",
        image: "https://files.catbox.moe/khycj5.jpg"
      },
      {
        name: "Monkey D. Garp",
        rank: "S",
        power: 75,
        health: 720,
        speed: 105,
        image: "https://files.catbox.moe/cpj0sj.jpg"
      },
      {
        name: "Monkey D. Garp II",
        rank: "SS",
        power: 85,
        health: 800,
        speed: 110,
        evolvesFrom: "Monkey D. Garp",
        image: "https://files.catbox.moe/gr3ozi.png"
      },

      {
        name: "Sengoku",
        rank: "SS",
        power: 86,
        health: 780,
        speed: 100,
        image: "https://files.catbox.moe/wtrvde.jpg"
      },
      {
        name: "Jinbe",
        rank: "A",
        power: 50,
        health: 520,
        speed: 100,
        image: "https://files.catbox.moe/47xh9e.webp"
      },
      {
        name: "Jinbe II",
        rank: "S",
        power: 65,
        health: 600,
        speed: 110,
        image: "https://files.catbox.moe/dgjdyu.jpg",
        evolvesFrom: "Jinbe"
      },
      {
        name: "Crocodile",
        rank: "S",
        power: 69,
        health: 580,
        speed: 120,
        image: "https://files.catbox.moe/lcm564.jpg"
      },
{
  name: "Marco",
  rank: "A",
  power: 63,
  health: 540,
  speed: 150,
  image: "https://files.catbox.moe/nq6ps2.png" 
},
{
  name: "Marco II",
  rank: "S",
  power: 71,
  health: 600,
  speed: 160,
  evolvesFrom: "Marco",
  image: "https://files.catbox.moe/djy3sg.jpg"
},

      {
        name: "Vista",
        rank: "A",
        power: 52,
        health: 500,
        speed: 130,
        image: "https://files.catbox.moe/gahk4f.webp"
      },
      {
        name: "Jozu",
        rank: "A",
        power: 54,
        health: 580,
        speed: 90,
        image: "https://files.catbox.moe/be95ov.webp"
      },

{
  name: "Silvers Rayleigh",
  rank: "S",
  power: 82,
  health: 670,
  speed: 150,
  image: "https://files.catbox.moe/7r70v2.png" 
},
      {
        name: "Silvers Rayleigh II",
        rank: "SS",
        power: 90,
        health: 720,
        speed: 160,
        image: "https://files.catbox.moe/16ob2z.png" ,
        evolvesFrom: "Silvers Rayleigh"
      },
     
      {
        name: "PX-1 Pacifista",
        rank: "A",
        power: 55,
        health: 560,
        speed: 95,
        image: "https://files.catbox.moe/ejmgfv.png"
      },
      {
        name: "Boa Hancock",
        rank: "S",
        power: 72,
        health: 600,
        speed: 150,
        image: "https://files.catbox.moe/dy75mr.jpg"
      },
      {
        name: "Buggy",
        rank: "C",
        power: 28,
        health: 300,
        speed: 90,
        image: "https://files.catbox.moe/hz88jq.jpg"
      },
      {
        name: "Buggy II",
        rank: "B",
        power: 41,
        health: 360,
        speed: 100,
        image: "https://files.catbox.moe/sflx1z.jpg",
        evolvesFrom: "Buggy"
      },
        {
          name: "Buggy III",
          rank: "A",
          power: 58,
          health: 430,
          speed: 110,
          evolvesFrom: "Buggy II",
          image: "https://files.catbox.moe/cyug07.jpg" 
        },
          {
            name: "Caesar Clown",
            rank: "A",
            power: 53,
            health: 500,
            speed: 110,
            image: "https://files.catbox.moe/2ae4pt.png"
          },
          {
            name: "Caesar Clown II",
            rank: "S",
            power: 68,
            health: 580,
            speed: 130,
            image: "https://files.catbox.moe/blucws.png",
            evolvesFrom: "Caesar Clown"
          },
          {
            name: "Vergo",
            rank: "S",
            power: 66,
            health: 620,
            speed: 115,
            image: "https://files.catbox.moe/5hgoyh.png" 
          },
          {
            name: "Monet",
            rank: "B",
            power: 45,
            health: 380,
            speed: 125,
            image: "https://files.catbox.moe/qv8kkp.png"
          },
          {
            name: "Brownbeard",
            rank: "C",
            power: 25,
            health: 280,
            speed: 70,
            image: "https://files.catbox.moe/px6y3p.png"
          },
          {
            name: "Yeti Cool Brothers",
            rank: "B",
            power: 43,
            health: 400,
            speed: 110,
            image: "https://files.catbox.moe/bewtl1.png"
          },
          {
            name: "Kin'emon",
            rank: "B",
            power: 46,
            health: 400,
            speed: 110,
            image: "https://files.catbox.moe/vne55h.png"
          },
          {
            name: "Kin'emon II",
            rank: "A",
            power: 60,
            health: 500,
            speed: 120,
            image: "https://files.catbox.moe/dqve92.png",
            evolvesFrom: "Kin'emon"
          },
          {
            name: "Momonosuke",
            rank: "C",
            power: 20,
            health: 200,
            speed: 100,
            image: "https://files.catbox.moe/o6yvyy.png"
          },
      {
        name: "Momonosuke II",
        rank: "A",
        power: 62,
        health: 500,
        speed: 130,
        evolvesFrom: "Momonosuke",
        image: "https://files.catbox.moe/gbql9x.png" 
      },
      {
        name: "Donquixote Doflamingo",
        rank: "S",
        power: 74,
        health: 700,
        speed: 140,
        image: "https://files.catbox.moe/a5to49.png"
      },
      {
        name: "Donquixote Doflamingo II",
        rank: "SS",
        power: 89,
        health: 820,
        speed: 160,
        image: "https://files.catbox.moe/2bmope.png",
        evolvesFrom: "Donquixote Doflamingo"
      },
      {
        name: "Pica",
        rank: "A",
        power: 59,
        health: 560,
        speed: 80,
        image: "https://files.catbox.moe/460hc1.png"
      },
      {
        name: "Diamante",
        rank: "A",
        power: 57,
        health: 540,
        speed: 120,
        image: "https://files.catbox.moe/a1tgk1.png"
      },
      {
        name: "Trebol",
        rank: "A",
        power: 56,
        health: 530,
        speed: 100,
        image: "https://files.catbox.moe/ncepb4.png"
      },
      {
        name: "Sugar",
        rank: "B",
        power: 41,
        health: 280,
        speed: 115,
        image: "https://files.catbox.moe/9blhib.png"
      },
      {
        name: "Lao G",
        rank: "B",
        power: 43,
        health: 390,
        speed: 105,
        image: "https://files.catbox.moe/9lkl89.png"
      },
      {
        name: "Gladius",
        rank: "B",
        power: 45,
        health: 400,
        speed: 110,
        image: "https://files.catbox.moe/6zmfqo.webp"
      },
      {
        name: "Dellinger",
        rank: "B",
        power: 46,
        health: 370,
        speed: 130,
        image: "https://files.catbox.moe/mjtgky.png"
      },
      {
        name: "Señor Pink",
        rank: "B",
        power: 44,
        health: 410,
        speed: 90,
        image: "https://files.catbox.moe/rv6bds.png"
      },
      {
        name: "Baby 5",
        rank: "B",
        power: 42,
        health: 360,
        speed: 120,
        image: "https://files.catbox.moe/g29rxj.png"
      },
      {
        name: "Bellamy",
        rank: "C",
        power: 30,
        health: 320,
        speed: 100,
        image: "https://files.catbox.moe/949psx.png"
      },
      {
        name: "Bellamy II",
        rank: "B",
        power: 45,
        health: 420,
        speed: 115,
        image: "https://files.catbox.moe/vedsmx.png",
        evolvesFrom: "Bellamy"
      },
      {
        name: "Kyros",
        rank: "A",
        power: 58,
        health: 520,
        speed: 115,
        image: "https://files.catbox.moe/wud73v.webp"
      },
      {
        name: "Rebecca",
        rank: "B",
        power: 42,
        health: 360,
        speed: 115,
        image: "https://files.catbox.moe/wkebow.png",
      },
      {
        name: "Cavendish",
        rank: "B",
        power: 46,
        health: 400,
        speed: 120,
        image: "https://files.catbox.moe/zehzjx.png"
      },
      {
        name: "Bartolomeo",
        rank: "B",
        power: 45,
        health: 420,
        speed: 110,
        image: "https://files.catbox.moe/xv0h0r.png"
      },
      {
        name: "Wanda",
        rank: "C",
        power: 26,
        health: 310,
        speed: 120,
        image: "https://files.catbox.moe/2nhiqe.png"
      },
      {
        name: "Carrot",
        rank: "B",
        power: 44,
        health: 360,
        speed: 180,
        image: "https://files.catbox.moe/euzew6.png"
      },
      {
        name: "Carrot II (Sulong)",
        rank: "S",
        power: 72,
        health: 580,
        speed: 260,
        image: "https://files.catbox.moe/v1973l.png",
        evolvesFrom: "Carrot"
      },
      {
        name: "Inuarashi",
        rank: "A",
        power: 55,
        health: 520,
        speed: 140,
        image: "https://files.catbox.moe/2wzu2q.png"
      },
      {
        name: "Nekomamushi",
        rank: "A",
        power: 56,
        health: 540,
        speed: 135,
        image: "https://files.catbox.moe/91mxw7.png"
      },
      {
        name: "Pedro",
        rank: "B",
        power: 45,
        health: 400,
        speed: 150,
        image: "https://files.catbox.moe/69au4z.png"
      },
      {
        name: "Miyagi",
        rank: "C",
        power: 24,
        health: 280,
        speed: 100,
        image: "https://files.catbox.moe/6909dq.png"
      },
      {
        name: "Tristan",
        rank: "C",
        power: 23,
        health: 270,
        speed: 100,
        image: "https://files.catbox.moe/tgv2ch.png"
      },
      {
        name: "Zunisha",
        rank: "SS",
        power: 92,
        health: 1000,
        speed: 40,
        image: "https://files.catbox.moe/pq78h8.png"
      },
      {
        name: "Nefertari Cobra",
        rank: "C",
        power: 22,
        health: 280,
        speed: 90,
        image: "https://files.catbox.moe/it3agx.png"
      },
      {
        name: "Nefertari Vivi",
        rank: "B",
        power: 40,
        health: 360,
        speed: 130,
        image: "https://files.catbox.moe/r3y2mp.png"
      },
      {
        name: "Sai",
        rank: "B",
        power: 43,
        health: 400,
        speed: 140,
        image: "https://files.catbox.moe/oo5367.png"
      },
      {
        name: "Leo",
        rank: "C",
        power: 25,
        health: 300,
        speed: 150,
        image: "https://files.catbox.moe/q9cccf.png"
      },
      {
        name: "Riku Doldo III",
        rank: "C",
        power: 20,
        health: 260,
        speed: 80,
        image: "https://files.catbox.moe/85nl5n.png"
      },
      {
        name: "Stelly",
        rank: "C",
        power: 15,
        health: 240,
        speed: 90,
        image: "https://files.catbox.moe/2tntxv.png"
      },
      {
        name: "Fujitora",
        rank: "SS",
        power: 88,
        health: 740,
        speed: 130,
        image: "https://files.catbox.moe/9z5xlc.png"
      },
      {
        name: "Ryokugyu (Green Bull)",
        rank: "SS",
        power: 89,
        health: 720,
        speed: 140,
        image: "https://files.catbox.moe/dqk7jx.png"
      },
      {
        name: "Sabo",
        rank: "SS",
        power: 91,
        health: 700,
        speed: 170,
        image: "https://files.catbox.moe/m2l6y7.png"
      },
      {
        name: "Charlotte Brûlée",
        rank: "C",
        power: 28,
        health: 340,
        speed: 90,
        image: "https://files.catbox.moe/seml0e.png"
      },
      {
        name: "Charlotte Opera",
        rank: "C",
        power: 30,
        health: 360,
        speed: 85,
        image: "https://files.catbox.moe/it5726.png"
      },
      {
        name: "Charlotte Mont-d'Or",
        rank: "B",
        power: 46,
        health: 420,
        speed: 110,
        image: "https://files.catbox.moe/9hshd7.png"
      },
      {
        name: "Charlotte Daifuku",
        rank: "B",
        power: 48,
        health: 450,
        speed: 120,
        image: "https://files.catbox.moe/glufqq.png"
      },
      {
        name: "Charlotte Oven",
        rank: "A",
        power: 62,
        health: 520,
        speed: 130,
        image: "https://files.catbox.moe/7ohy62.png"
      },
      {
        name: "Charlotte Smoothie",
        rank: "S",
        power: 75,
        health: 680,
        speed: 140,
        image: "https://files.catbox.moe/jhaslm.png"
      },
      {
        name: "Charlotte Cracker",
        rank: "S",
        power: 76,
        health: 650,
        speed: 150,
        image: "https://files.catbox.moe/9bocfa.png"
      },
      {
        name: "Charlotte Katakuri",
        rank: "SS",
        power: 92,
        health: 800,
        speed: 190,
        image: "https://files.catbox.moe/3xr5gq.png"
      },
      {
        name: "Vinsmoke Yonji",
        rank: "B",
        power: 44,
        health: 400,
        speed: 130,
        image: "https://files.catbox.moe/37025z.png"
      },
      {
        name: "Vinsmoke Niji",
        rank: "B",
        power: 45,
        health: 420,
        speed: 135,
        image: "https://files.catbox.moe/1w5tvo.png"
      },
      {
        name: "Vinsmoke Ichiji",
        rank: "A",
        power: 60,
        health: 500,
        speed: 150,
        image: "https://files.catbox.moe/y3z4ks.png"
      },
      {
        name: "Vinsmoke Reiju",
        rank: "A",
        power: 58,
        health: 480,
        speed: 160,
        image: "https://files.catbox.moe/5oli5o.png"
      },
      {
        name: "Vinsmoke Judge",
        rank: "S",
        power: 73,
        health: 600,
        speed: 140,
        image: "https://files.catbox.moe/0gpz1t.png"
      },
      {
        name: "Morgans",
        rank: "C",
        power: 25,
        health: 300,
        speed: 100,
        image: "https://files.catbox.moe/7igxxg.png"
      },
      {
        name: "Shutenmaru",
        rank: "B",
        power: 45,
        health: 460,
        speed: 110,
        image: "https://files.catbox.moe/u4ozpa.png"
      },
      {
        name: "Kawamatsu",
        rank: "A",
        power: 61,
        health: 520,
        speed: 125,
        image: "https://files.catbox.moe/jwrlps.png"
      },
      {
        name: "Raizo",
        rank: "B",
        power: 47,
        health: 440,
        speed: 130,
        image: "https://files.catbox.moe/5nq3oj.png"
      },
      {
        name: "Kiku",
        rank: "B",
        power: 46,
        health: 430,
        speed: 135,
        image: "https://files.catbox.moe/jucujw.png"
      },
{
  name: "Denjiro",
  rank: "B",
  power: 52,
  health: 480,
  speed: 110,
  image: "https://files.catbox.moe/d1hw9x.png"
},
{
  name: "Denjiro II",
  rank: "A",
  power: 68,
  health: 580,
  speed: 120,
  evolvesFrom: "Denjiro",
  image: "https://files.catbox.moe/nnn4ln.png" 
},

      {
        name: "Ashura Doji",
        rank: "A",
        power: 64,
        health: 580,
        speed: 115,
        image: "https://files.catbox.moe/gwgjdw.png"
      },
      {
        name: "Kurozumi Orochi",
        rank: "B",
        power: 44,
        health: 420,
        speed: 90,
        image: "https://files.catbox.moe/0xo10i.png"
      },
      {
        name: "Fukurokuju",
        rank: "B",
        power: 43,
        health: 410,
        speed: 95,
        image: "https://files.catbox.moe/kdmrik.png"
      },
      {
        name: "Komurasaki",
        rank: "C",
        power: 22,
        health: 300,
        speed: 85,
        image: "https://files.catbox.moe/v7jr13.png"
      },
{
  name: "Yasuie",
  rank: "C",
  power: 18,
  health: 240,
  speed: 95,
  image: "https://files.catbox.moe/u3h4kk.png"
},
{
  name: "Yasuie II",
  rank: "B",
  power: 48,
  health: 400,
  speed: 105,
  evolvesFrom: "Yasuie",
  image: "https://files.catbox.moe/75mxug.jpg" 
},

{
  name: "Hyogoro",
  rank: "C",
  power: 26,
  health: 250,
  speed: 90,
  image: "https://files.catbox.moe/25vwkr.png"
},
{
  name: "Hyogoro II",
  rank: "B",
  power: 50,
  health: 400,
  speed: 110,
  evolvesFrom: "Hyogoro",
  image: "https://files.catbox.moe/2ua4ky.png" 
},
      {
        name: "Toko",
        rank: "C",
        power: 10,
        health: 150,
        speed: 70,
        image: "https://files.catbox.moe/3n4uhk.png"
      },
      {
        name: "Onimaru",
        rank: "C",
        power: 27,
        health: 320,
        speed: 100,
        image: "https://files.catbox.moe/r73gez.png"
      },
      {
        name: "Udon Prisoner Daifugo",
        rank: "C",
        power: 28,
        health: 340,
        speed: 95,
        image: "https://files.catbox.moe/8ty2qp.png"
      },
{
  name: "Ulti",
  rank: "A",
  power: 68,
  health: 580,
  speed: 150,
  image: "https://files.catbox.moe/0y61lf.png"
},
{
  name: "Page One",
  rank: "A",
  power: 67,
  health: 570,
  speed: 145,
  image: "https://files.catbox.moe/2mk2id.png"
},
{
  name: "Sasaki",
  rank: "A",
  power: 66,
  health: 560,
  speed: 135,
  image: "https://files.catbox.moe/3ghdxh.png"
},
{
  name: "Black Maria",
  rank: "A",
  power: 69,
  health: 590,
  speed: 130,
  image: "https://files.catbox.moe/tq20pv.png"
},
{
  name: "Who's Who",
  rank: "A",
  power: 70,
  health: 600,
  speed: 140,
  image: "https://files.catbox.moe/6gum0a.png"
},
{
  name: "Hotei",
  rank: "B",
  power: 50,
  health: 480,
  speed: 100,
  image: "https://files.catbox.moe/yix0bp.png"
},
{
  name: "Bao Huang",
  rank: "C",
  power: 25,
  health: 300,
  speed: 120,
  image: "https://files.catbox.moe/cex3js.png"
},
{
  name: "Perospero",
  rank: "A",
  power: 64,
  health: 500,
  speed: 120,
  image: "https://files.catbox.moe/8jja5p.png"
},
  {
    name: "Big Mom",
    rank: "SS",
    power: 91,
    health: 780,
    speed: 155,
    image: "https://files.catbox.moe/gxfmnf.png"
  },
{
  name: "Big Mom II",
  rank: "UR",
  power: 105,
  health: 860,
  speed: 160,
  evolvesFrom: "Big Mom",
  image: "https://files.catbox.moe/811u07.png"
},
{
  name: "Kaido",
  rank: "SS",
  power: 95,
  health: 800,
  speed: 160,
  image: "https://files.catbox.moe/uc1j6b.png",
},
{
  name: "Kaido II",
  rank: "UR",
  power: 100,
  health: 880,
  speed: 170,
  image: "https://files.catbox.moe/q0rjt4.png",
  evolvesFrom: "Kaido"
},
{
  name: "King",
  rank: "SS",
  power: 88,
  health: 720,
  speed: 155,
  image: "https://files.catbox.moe/xzopa4.png"
},
{
  name: "Queen",
  rank: "S",
  power: 78,
  health: 740,
  speed: 100,
  image: "https://files.catbox.moe/8xzvmx.png"
},
{
  name: "Jack",
  rank: "S",
  power: 78,
  health: 690,
  speed: 130,
  image: "https://files.catbox.moe/xa8cv8.png"
},
{
  name: "Izo",
  rank: "B",
  power: 45,
  health: 430,
  speed: 110,
  image: "https://files.catbox.moe/p2gpzt.png"
},
{
  name: "Izo II",
  rank: "A",
  power: 55,
  health: 530,
  speed: 120,
  image: "https://files.catbox.moe/nz6b91.png",
  evolvesFrom: "Izo"
},
      {
        name: "Figarland Garling",
        rank: "SS",
        power: 93,
        health: 780,
        speed: 150,
        image: "https://files.catbox.moe/dr9bj9.png"
      },
      {
        name: "The Five Elders",
        rank: "UR",
        power: 102,
        health: 820,
        speed: 140,
        image: "https://files.catbox.moe/jgv9sv.png"
      },
      {
        name: "Dracule Mihawk",
        rank: "SS",
        power: 95,
        health: 720,
        speed: 165,
        image: "https://files.catbox.moe/5vvubz.png"
      },
      {
        name: "Monkey D. Dragon",
        rank: "SS",
        power: 92,
        health: 740,
        speed: 160,
        image: "https://files.catbox.moe/vmzjcb.png"
      },
      {
        name: "Marshall D. Teach",
        rank: "S",
        power: 76,
        health: 600,
        speed: 100,
        image: "https://files.catbox.moe/x01q3d.png"
      },
      {
        name: "Marshall D. Teach II",
        rank: "UR",
        power: 103,
        health: 850,
        speed: 120,
        evolvesFrom: "Marshall D. Teach",
        image: "https://files.catbox.moe/j96kud.png"
      },
      {
        name: "Shanks",
        rank: "UR",
        power: 105,
        health: 800,
        speed: 180,
        image: "https://files.catbox.moe/appxg3.png"
      },
      {
        name: "IMU",
        rank: "UR",
        power: 110,
        health: 880,
        speed: 170,
        image: "https://files.catbox.moe/raier9.png"
      },
      {
        name: "Rocks D. Xebec",
        rank: "UR",
        power: 108,
        health: 860,
        speed: 165,
        image: "https://files.catbox.moe/9jbqdp.png"
      },
      {
        name: "Kozuki Oden",
        rank: "A",
        power: 68,
        health: 520,
        speed: 130,
        image: "https://files.catbox.moe/4sqwh9.png"
      },
      {
        name: "Kozuki Oden II",
        rank: "SS",
        power: 94,
        health: 780,
        speed: 150,
        evolvesFrom: "Kozuki Oden",
        image: "https://files.catbox.moe/97af10.png"
      },
      {
        name: "Yamato",
        rank: "S",
        power: 80,
        health: 680,
        speed: 150,
        image: "https://files.catbox.moe/2gtfei.png"
      }

















      

   ];

   module.exports = cards;