interface TubeDataConfig {
    [city: string]: {
      [line: string]: {
        color: string;
        data: any;
      };
    };
  }

export const tubeDataConfig: TubeDataConfig = {
    Lyon: {
      MA: {
        color: "#f052a4",
        data: require("../data/Lyon/MA.json"),
      },
      MB: {
        color: "#0077c0",
        data: require("../data/Lyon/MB.json"),
      },
      MC: {
        color: "#ffad39",
        data: require("../data/Lyon/MC.json"),
      },
      MD: {
        color: "#039303",
        data: require("../data/Lyon/MD.json"),
      },
      F1: {
        color: "#08e708",
        data: require("../data/Lyon/F1.json"),
      }
    },
    London: {
      Bakerloo: {
        color: "#B36305",
        data: require("../data/London/Bakerloo.json"),
      },
      Central: {
        color: "#E32017",
        data: require("../data/London/Central.json"),
      },
      Circle: {
        color: "#FFD300",
        data: require("../data/London/Circle.json"),
      },
      District: {
        color: "#00782A",
        data: require("../data/London/District.json"),
      },
      HammersmithCity: {
        color: "#F3A9BB",
        data: require("../data/London/HammersmithCity.json"),
      },
      Jubilee: {
        color: "#A0A5A9",
        data: require("../data/London/Jubilee.json"),
      },
      Metropolitan: {
        color: "#9B0056",
        data: require("../data/London/Metropolitan.json"),
      },
      Northern: {
        color: "#000000",
        data: require("../data/London/Northern.json"),
      },
      Piccadilly: {
        color: "#003688",
        data: require("../data/London/Piccadilly.json"),
      },
      Victoria: {
        color: "#0098D4",
        data: require("../data/London/Victoria.json"),
      },
      WaterlooCity: {
        color: "#95CDBA",
        data: require("../data/London/WaterlooCity.json"),
      }
    },
    Paris: {
      M1: {
        color: "#ffbe00",
        data: require("../data/Paris/M1.json"),
      },
      M2: {
        color: "#0055c8",
        data: require("../data/Paris/M2.json"),
      },
      M3: {
        color: "#6e6e00",
        data: require("../data/Paris/M3.json"),
      },
      M3bis: {
        color: "#6ec4e8",
        data: require("../data/Paris/M3bis.json"),
      },
      M4: {
        color: "#a0006e",
        data: require("../data/Paris/M4.json"),
      },
      M5: {
        color: "#ff7e2e",
        data: require("../data/Paris/M5.json"),
      },
      M6: {
        color: "#6eca97",
        data: require("../data/Paris/M6.json"),
      },
      M7: {
        color: "#fa9aba",
        data: require("../data/Paris/M7.json"),
      },
      M7bis: {
        color: "#6eca97",
        data: require("../data/Paris/M7bis.json"),
      },
      M8: {
        color: "#d282be",
        data: require("../data/Paris/M8.json"),
      },
      M9: {
        color: "#b6bd00",
        data: require("../data/Paris/M9.json"),
      },
      M10: {
        color: "#c9910d",
        data: require("../data/Paris/M10.json"),
      },
      M11: {
        color: "#704b1c",
        data: require("../data/Paris/M11.json"),
      },
      M12: {
        color: "#007852",
        data: require("../data/Paris/M12.json"),
      },
      M13: {
        color: "#6ec4e8",
        data: require("../data/Paris/M13.json"),
      },
      M14: {
        color: "#62259d",
        data: require("../data/Paris/M14.json"),
      },
    }, NewYorkCity: {
      s1: {
        color: "#ee352e",
        data: require("../data/NewYorkCity/s1.json"),
      },
      s2: {
        color: "#ee352e",
        data: require("../data/NewYorkCity/s2.json"),
      },
      s3: {
        color: "#ee352e",
        data: require("../data/NewYorkCity/s3.json"),
      },
      s4: {
        color: "#00933c",
        data: require("../data/NewYorkCity/s4.json"),
      },
      s5: {
        color: "#00933c",
        data: require("../data/NewYorkCity/s5.json"),
      },
      s6: {
        color: "#00933c",
        data: require("../data/NewYorkCity/s5.json"),
      },
      s7: {
        color: "#b933ad",
        data: require("../data/NewYorkCity/s7.json"),
      },
      sA: {
        color: "#0039a6",
        data: require("../data/NewYorkCity/sA.json"),
      },
      sB: {
        color: "#ff6319",
        data: require("../data/NewYorkCity/sB.json"),
      },
      sC: {
        color: "#0039a6",
        data: require("../data/NewYorkCity/sC.json"),
      },
      sD: {
        color: "#ff6319",
        data: require("../data/NewYorkCity/sD.json"),
      },
      sE: {
        color: "#0039a6",
        data: require("../data/NewYorkCity/sE.json"),
      },
      sF: {
        color: "#ff6319",
        data: require("../data/NewYorkCity/sF.json"),
      },
      sG: {
        color: "#6cbe45",
        data: require("../data/NewYorkCity/sG.json"),
      },
      JZ: {
        color: "#996633",
        data: require("../data/NewYorkCity/sJZ.json"),
      },
      sL: {
        color: "#a7a9ac",
        data: require("../data/NewYorkCity/sL.json"),
      },
      sM: {
        color: "#ff6319",
        data: require("../data/NewYorkCity/sM.json"),
      },
      sN: {
        color: "#fccc0a",
        data: require("../data/NewYorkCity/sN.json"),
      },
      sQ: {
        color: "#fccc0a",
        data: require("../data/NewYorkCity/sQ.json"),
      },
      sR: {
        color: "#fccc0a",
        data: require("../data/NewYorkCity/sR.json"),
      },
      sS: {
        color: "#808183",
        data: require("../data/NewYorkCity/sS.json"),
      },
      sW: {
        color: "#fccc0a",
        data: require("../data/NewYorkCity/sW.json"),
      },
    }, Madrid: {
      Line1: {
        color: "#2BB6E6",
        data: require("../data/Madrid/Line1.json"),
      },
      Line2: {
        color: "#EB2F29",
        data: require("../data/Madrid/Line2.json"),
      },
      Line3: {
        color: "#FED105",
        data: require("../data/Madrid/Line3.json"),
      },
      Line4: {
        color: "#A15C2F",
        data: require("../data/Madrid/Line4.json"),
      },
      Line5: {
        color: "#7AC142",
        data: require("../data/Madrid/Line5.json"),
      },
      Line6: {
        color: "#737F86",
        data: require("../data/Madrid/Line6.json"),
      },
      Line7: {
        color: "#F79727",
        data: require("../data/Madrid/Line7.json"),
      },
      Line8: {
        color: "#DB74AE",
        data: require("../data/Madrid/Line8.json"),
      },
      Line9: {
        color: "#9C3293",
        data: require("../data/Madrid/Line9.json"),
      },
      Line10: {
        color: "#015396",
        data: require("../data/Madrid/Line10.json"),
      },
      Line11: {
        color: "#00A94E",
        data: require("../data/Madrid/Line11.json"),
      },
      Line12: {
        color: "#A49901",
        data: require("../data/Madrid/Line12.json"),
      },
      LineR: {
        color: "#0E4A97",
        data: require("../data/Madrid/LineR.json"),
      }
    }, Berlin: {
      U1: {
        color: "#7EAF4B",
        data: require("../data/Berlin/U1.json"),
      },
      U2: {
        color: "#DA421E",
        data: require("../data/Berlin/U2.json"),
      },
      U3: {
        color: "#2E937D",
        data: require("../data/Berlin/U3.json"),
      },
      U4: {
        color: "#F0D722",
        data: require("../data/Berlin/U4.json"),
      },
      U5: {
        color: "#7E5330",
        data: require("../data/Berlin/U5.json"),
      },
      U6: {
        color: "#8C6DAB",
        data: require("../data/Berlin/U6.json"),
      },
      U7: {
        color: "#528DBA",
        data: require("../data/Berlin/U7.json"),
      },
      U8: {
        color: "#224F86",
        data: require("../data/Berlin/U8.json"),
      },
      U9: {
        color: "#F3791D",
        data: require("../data/Berlin/U9.json"),
      },
    }, Barcelona: {
      L1: {
        color: "#E02434",
        data: require("../data/Barcelona/L1.json"),
      },
      L2: {
        color: "#9A398D",
        data: require("../data/Barcelona/L2.json"),
      },
      L3: {
        color: "#37A93C",
        data: require("../data/Barcelona/L3.json"),
      },
      L4: {
        color: "#FCBF00",
        data: require("../data/Barcelona/L4.json"),
      },
      L5: {
        color: "#0078BD",
        data: require("../data/Barcelona/L5.json"),
      },
      L6: {
        color: "#7487BD",
        data: require("../data/Barcelona/L6.json"),
      },
      L7: {
        color: "#B2660A",
        data: require("../data/Barcelona/L7.json"),
      },
      L8: {
        color: "#E67AAF",
        data: require("../data/Barcelona/L8.json"),
      },
      L9N: {
        color: "#F88E00",
        data: require("../data/Barcelona/L9N.json"),
      },
      L9S: {
        color: "#F88E00",
        data: require("../data/Barcelona/L9S.json"),
      },
      L10N: {
        color: "#01A1E6",
        data: require("../data/Barcelona/L10N.json"),
      },
      L10S: {
        color: "#01A1E6",
        data: require("../data/Barcelona/L10S.json"),
      },
      L11: {
        color: "#B5CE55",
        data: require("../data/Barcelona/L11.json"),
      },
    }
  };

  