/* eslint-disable no-dupe-keys */
export const exportGesBV = {
  bloc1: {
    label: "Données générales et identification de l'exploitation",
    content: {
      GEN_CODE_ORG: {
        type: ['BL', 'BV'],
        label: "Code de l'organisme auquel appartient le conseiller",
        value: 'ORG00078',
      },
      GEN_EDE: { type: ['BL', 'BV'], label: 'N°EDE', value: 44099111 },
      GEN_DATE_DIAG: { type: ['BL', 'BV'], label: 'Date de réalisation du diagnostic', value: '08/27/23' },
      GEN_ANNEE_DIAG: { type: ['BL', 'BV'], label: 'Année des données collectées', value: '2003' },
      GEN_LOGIN_CONS: {
        type: ['BL', 'BV'],
        label: "Login CAP'2ER DE l'utilisateur associé au diagnostic",
        value: 'godoc_b',
      },
      GEN_E_MAIL: { type: ['BL', 'BV'], label: 'Adresse e-mail', value: 'brendan.godoc@idele.fr' },
      GEN_AUTORISATION_DONNEES: {
        type: ['BL', 'BV'],
        label:
          "J'atteste avoir informé l'éleveur et obtenu son accord pour que ses données soient stockées (de manière anonyme) dans la base centrale CAP'2ER® et soient utilisées par mon organisme et l'Institut de l'Elevage conformément à l'annexe 2 du contrat de licence CAP'2ER® signée par l'éleveur.",
        value: 'oui',
      },
      NIV1_BV_DEMARCHE_CARBONE: {
        type: ['BL', 'BV'],
        label: 'Participez-vous à une démarche Plan Carbone ?',
        value: 'Non',
      },
      NIV1_COMB_PROD: {
        type: ['BL', 'BV'],
        label: 'Combinaison de productions (type de système)',
        value: 'Herbivores',
      },
      GEN_HA_SAU: { type: ['BL', 'BV'], label: "Surface Agricole Utile (SAU) de l'exploitation", value: 120 },
      GEN_UGB_TOTAUX: { type: ['BL', 'BV'], label: "Nombre d'UGB total de l'exploitation", value: 122 },
      GEN_BV_TYPE: { type: ['BL'], label: 'Avez-vous un atelier Bovin viande ?', value: 'Non' },
      GEN_BL: { type: ['BL'], label: 'Avez-vous un atelier de petits ruminants ?', value: 'Non' },
      GEN_SIQO: { type: ['BL'], label: "L'atelier Bovin lait est-il sous signe(s) de qualité ?", value: 'Oui' },
      GEN_AB: { type: ['BL'], label: 'Agriculture biologique', value: 'Oui' },
      GEN_AOP: { type: ['BL'], label: 'AOP', value: 'Non' },
      GEN_IGP: { type: ['BL'], label: 'IGP', value: 'Non' },
      GEN_SIQO_AUTRE: { type: ['BL'], label: 'Autre (à préciser)', value: 'Non' },
      NIV1_MODULE_AGRO: { type: ['BL'], label: 'Souhaitez-vous renseignez le module Agronomie ?', value: 'Non ' },
    },
  },
  bloc2: {
    label: 'Données à saisir :',
    content: {
      unknown: { label: 'Région', value: 'PAYS-DE-LA-LOIRE' },
      unknown: { label: 'Typologie', value: 'Montagne Herbager' },
      TROUP_RACE1_BL: { type: ['BL', 'BV'], label: 'Race', value: "Prim' Holstein - 66" },
      unknown: { label: 'TB', value: { quantity: '42,3', unity: 'g/Kg' } },
      unknown: { label: 'TP', value: { quantity: '33,8', unity: 'g/Kg' } },
      unknown: { label: 'ML de haies', value: { quantity: 0, unity: 'mètres linéaires' } },
    },
  },
  bloc3: {
    label: 'Le troupeau bovin lait',
    content: {
      NIV1_BL_NBTETE_VL: {
        type: ['BL'],
        label: "Nombre moyen de vaches laitières sur l'année",
        value: {
          quantity: 78,
          unity: 'têtes',
        },
      },
      NIV1_BL_NBTETE_G3: {
        type: ['BL'],
        label: "Nombre de génisses qui ont vêlé sur l'année étudiée (primipares)",
        value: {
          quantity: 20,
          unity: 'têtes',
        },
      },
      NIV1_BL_AGE_VELAGE: {
        type: ['BL'],
        label: 'Age moyen au premier vêlage',
        value: { quantity: 29, unity: 'mois' },
      },
      NIV1_BL_TPSBAT_VL: {
        type: ['BL'],
        label: 'Temps moyen passé au bâtiment pour les vaches laitières',
        value: {
          quantity: 6.8,
          unity: 'mois/an',
        },
      },
      NIV1_BL_BAT_TYPE_VL: {
        type: ['BL'],
        label: 'Mode de logement des vaches laitières',
        value: 'Logettes lisier/fumier',
      },
      'Lait produit': { quantity: 546000, unity: 'litres bruts/an' },
      NIV1_BL_LAIT_VENDU: {
        type: ['BL'],
        label: 'Lait total vendu (y compris le lait transformé et vendu en vente directe)',
        value: {
          quantity: 518700,
          unity: 'litres bruts/an',
        },
      },
      NIV1_BL_LAIT_AUTO: {
        type: ['BL'],
        label: 'Lait donné aux veaux/autoconsommé/jeté',
        value: {
          quantity: 27300,
          unity: 'litres bruts/an',
        },
      },
      NIV1_BL_TB: { type: ['BL'], label: 'Taux butyreux', value: { quantity: '42,3', unity: 'g/Kg' } },
      NIV1_BL_TP: { type: ['BL'], label: 'Taux protéique', value: { quantity: '33,8', unity: 'g/Kg' } },
    },
  },
  bloc4: {
    label: 'Les surfaces liées au troupeau (bovin lait et bovin viande)',
    content: {
      NIV1_SURF_HA_PP: { type: ['BL', 'BV'], label: 'Prairies permanentes', value: { quantity: 10, unity: 'ha' } },
      NIV1_SURF_HA_PT: { type: ['BL', 'BV'], label: 'Prairies temporaires', value: { quantity: 83, unity: 'ha' } },
      NIV1_SURF_HA_FOU: {
        type: ['BL', 'BV'],
        label: 'Maïs ensilage et autres fourrages',
        value: { quantity: 12, unity: 'ha' },
      },
      NIV1_SURF_IAE_HAIE: {
        type: ['BL', 'BV'],
        label: 'Mètres linéaires de haies',
        vamue: {
          quantity: 9927,
          unity: 'mètres linéaires ',
        },
      },
    },
  },
  bloc5: {
    label: 'Les surfaces liées au troupeau bovin lait',
    content: {
      NIV1_BL_N_ORGA_EXPORTE: {
        type: ['BL'],
        label: 'Azote organique exporté',
        value: { quantity: 0, unity: 'UN/an' },
      },
      NIV1_BL_SURF_QTE_CER_AUTOCONSO: {
        type: ['BL'],
        label: 'Céréales autoconsommées - Quantités',
        value: {
          quantity: 45,
          unity: 'tonnes brutes/an',
        },
      },
      NIV1_BL_SURF_RDT_CER_AUTOCONSO: {
        type: ['BL'],
        label: 'Rendement des céréales autoconsommées',
        value: {
          quantity: 30,
          unity: 'quintaux/ha',
        },
      },
    },
  },
  bloc6: {
    label: 'Les intrants utilisés par le troupeau (bovin lait et bovin viande)',
    content: {
      NIV1_N_MIN: { type: ['BL', 'BV'], label: 'Azote minéral utilisé', value: { quantity: 0, untity: 'UN/an' } },
      NIV1_ALIMENTS_ACHETES: {
        type: ['BL', 'BV'],
        label: 'Aliments achetés (céréales, tourteaux, aliments composés, CMV…)',
        value: {
          quantity: 21,
          untity: 'tonnes brutes/an',
        },
      },
      NIV1_ALIMENTS_ACHETES_TX_SOJA: {
        type: ['BL', 'BV'],
        label: 'Dont tourteaux de soja',
        value: { quantity: 0, untity: 'tonnes brutes/an' },
      },
    },
  },
  bloc7: {
    label: 'Les intrants utilisés par le troupeau bovin lait ',
    content: {
      NIV1_BL_ELEC: { type: ['BL'], label: "Consommation d'électricité", value: { quantity: 0, unity: 'kWh/an' } },
      NIV1_BL_CARBU: {
        type: ['BL'],
        label: 'Consommation de carburants',
        value: { quantity: 8285, unity: 'litres/an' },
      },
      NIV1_BL_N_ORGA_IMPORTE: {
        type: ['BL'],
        label: 'Azote organique importé',
        value: { quantity: 0, unity: 'UN/an' },
      },
    },
  },
  bloc8: {
    label: 'Le troupeau bovin viande',
    content: {
      unknown: { type: ['BV'], label: "Type d'atelier", value: 'Naisseur - engraisseur ' },
      unknown: {
        type: ['BV'],
        label: "Nombre moyen de vaches allaitantes sur l'année",
        value: {
          quantity: 0,
          unity: 'têtes',
        },
      },
      unknown: { type: ['BV'], label: 'Génisses 0-1 an', value: { quantity: 0, unity: 'têtes' } },
      unknown: { type: ['BV'], label: 'Génisses 1-2 ans ', value: { quantity: 0, unity: 'têtes' } },
      unknown: { type: ['BV'], label: 'Génisses >2ans', value: { quantity: 0, unity: 'têtes' } },
      unknown: { type: ['BV'], label: 'Mâle 0-1 an', value: { quantity: 0, unity: 'têtes' } },
      unknown: { type: ['BV'], label: 'Mâle 1-2 ans', value: { quantity: 0, unity: 'têtes' } },
      unknown: { type: ['BV'], label: 'Mâle  >2 ans', value: { quantity: 0, unity: 'têtes' } },
      unknown: {
        type: ['BV'],
        label: 'Temps moyen passé au bâtiment pour les vaches et les génisses',
        value: {
          quantity: 0,
          unity: 'mois/an',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Temps moyen passé au bâtiment pour les mâles',
        value: {
          quantity: 0,
          unity: 'mois/an',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Mode de logement majoritaire du troupeau viande',
        value: 'Aire paillée intégrale',
      },
      unknown: {
        type: ['BV'],
        label: "Poids des vaches de réforme à l'abattage",
        value: {
          quantity: 450,
          unity: 'Kg carcasse/ tete',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Quantité de viande vendu',
        value: {
          quantity: 89900,
          unity: 'Kg vif ',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Dont quantité de viande maigre vendue',
        value: {
          quantity: 0,
          unity: 'Kg vif ',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Dont quantité de viande finie vendue',
        value: {
          quantity: 89900,
          unity: 'Kg vif ',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Poids total des animaux achetés ',
        value: {
          quantity: 0,
          unity: 'Kg vif ',
        },
      },
      unknown: {
        type: ['BV'],
        label: "Variation d'inventaire",
        value: {
          quantity: 0,
          unity: 'Kg vif ',
        },
      },
      unknown: {
        type: ['BV'],
        label: 'Production brute de viande',
        value: {
          quantity: 0,
          unity: 'Kg vif ',
        },
      },
    },
  },
  bloc9: {
    label: 'Les surfaces liées au troupeau bovin viande',
    content: {
      NIV1_BV_N_ORGA_EXPORTE: {
        type: ['BV'],
        label: 'Azote organique exporté',
        value: { quantity: 0, unity: 'UN/an' },
      },
      NIV1_BV_SURF_QTE_CER_AUTOCONSO: {
        type: ['BV'],
        label: 'Céréales autoconsommées - Quantités',
        value: {
          quantity: 0,
          unity: 'tonnes brutes/an',
        },
      },
      NIV1_BV_SURF_RDT_CER_AUTOCONSO: {
        type: ['BV'],
        label: 'Rendement des céréales autoconsommées',
        value: {
          quantity: 0,
          unity: 'quintaux/ha',
        },
      },
    },
  },
  bloc10: {
    label: 'Les intrants utilisés par le troupeau bovin viande',
    content: {
      NIV1_BV_ELEC: { type: ['BV'], label: "Consommation d'électricité", value: { quantity: 0, unity: 'kWh/an' } },
      NIV1_BV_CARBU: {
        type: ['BV'],
        label: 'Consommation de carburants',
        value: { quantity: 8285, unity: 'litres/an' },
      },
      NIV1_BV_N_ORGA: {
        type: ['BV'],
        label: 'Azote organique importé',
        value: { quantity: 0, unity: 'UN/an' },
      },
    },
  },
}
