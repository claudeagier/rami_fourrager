export const exportGesBV = {
  bloc1: {
    label: "Données générales et identification de l'exploitation",
    content: {
      GEN_CODE_ORG: { label: "Code de l'organisme auquel appartient le conseiller", value: 'ORG00078' },
      GEN_EDE: { label: 'N°EDE', value: 44099111 },
      GEN_DATE_DIAG: { label: 'Date de réalisation du diagnostic', value: '08/27/23' },
      GEN_ANNEE_DIAG: { label: 'Année des données collectées', value: '2003' },
      GEN_LOGIN_CONS: { label: "Login CAP'2ER DE l'utilisateur associé au diagnostic", value: 'godoc_b' },
      GEN_E_MAIL: { label: 'Adresse e-mail', value: 'brendan.godoc@idele.fr' },
      GEN_AUTORISATION_DONNEES: {
        label:
          "J'atteste avoir informé l'éleveur et obtenu son accord pour que ses données soient stockées (de manière anonyme) dans la base centrale CAP'2ER® et soient utilisées par mon organisme et l'Institut de l'Elevage conformément à l'annexe 2 du contrat de licence CAP'2ER® signée par l'éleveur.",
        value: 'oui',
      },
      NIV1_BV_DEMARCHE_CARBONE: { label: 'Participez-vous à une démarche Plan Carbone ?', value: 'Non' },
      NIV1_COMB_PROD: { label: 'Combinaison de productions (type de système)', value: 'Herbivores' },
      GEN_HA_SAU: { label: "Surface Agricole Utile (SAU) de l'exploitation", value: 120 },
      GEN_UGB_TOTAUX: { label: "Nombre d'UGB total de l'exploitation", value: 122 },
      GEN_BV_TYPE: { label: 'Avez-vous un atelier Bovin viande ?', value: 'Non' },
      GEN_BL: { label: 'Avez-vous un atelier de petits ruminants ?', value: 'Non' },
      GEN_SIQO: { label: "L'atelier Bovin lait est-il sous signe(s) de qualité ?", value: 'Oui' },
      GEN_AB: { label: 'Agriculture biologique', value: 'Oui' },
      GEN_AOP: { label: AOP, value: 'Non' },
      GEN_IGP: { label: IGP, value: 'Non' },
      GEN_SIQO_AUTRE: { label: 'Autre (à préciser)', value: 'Non' },
      NIV1_MODULE_AGRO: { label: 'Souhaitez-vous renseignez le module Agronomie ?', value: 'Non ' },
    },
  },
  bloc2: {
    label: 'Données à saisir :',
    content: {
      Région: 'PAYS-DE-LA-LOIRE',
      Typologie: 'Montagne Herbager',
      Race: "Prim' Holstein - 66",
      TB: { quantity: '42,3', unity: 'g/Kg' },
      TP: { quantity: '33,8', unity: 'g/Kg' },
      'ML de haies': { quantity: 0, unity: 'mètres linéaires' },
    },
  },
  bloc3: {
    label: 'Le troupeau bovin lait',
    content: {
      'BL/BV': 'BL',
      "Nombre moyen de vaches laitières sur l'année": {
        quantity: 78,
        unity: 'têtes',
      },
      "Nombre de génisses qui ont vêlé sur l'année étudiée (primipares)": {
        quantity: 20,
        unity: 'têtes',
      },
      'Age moyen au premier vêlage': { quantity: 29, unity: 'mois' },
      'Temps moyen passé au bâtiment pour les vaches laitières': {
        quantity: 6.8,
        unity: 'mois/an',
      },
      'Mode de logement des vaches laitières': 'Logettes lisier/fumier',
      'Lait produit': { quantity: 546000, unity: 'litres bruts/an' },
      'Lait total vendu (y compris le lait transformé et vendu en vente directe)': {
        quantity: 518700,
        unity: 'litres bruts/an',
      },
      'Lait donné aux veaux/autoconsommé/jeté': {
        quantity: 27300,
        unity: 'litres bruts/an',
      },
      'Taux butyreux': { quantity: '42,3', unity: 'g/Kg' },
      'Taux protéique': { quantity: '33,8', unity: 'g/Kg' },
    },
  },
  bloc4: {
    label: 'Les surfaces liées au troupeau (bovin lait et bovin viande)',
    content: {
      'Prairies permanentes': { quantity: 10, unity: 'ha' },
      'Prairies temporaires': { quantity: 83, unity: 'ha' },
      'Maïs ensilage et autres fourrages': { quantity: 12, unity: 'ha' },
      'Mètres linéaires de haies': {
        quantity: 9927,
        unity: 'mètres linéaires ',
      },
    },
  },
  bloc5: {
    label: 'Les surfaces liées au troupeau bovin lait',
    content: {
      'Azote organique exporté': { quantity: 0, unity: 'UN/an' },
      'Céréales autoconsommées - Quantités': {
        quantity: 45,
        unity: 'tonnes brutes/an',
      },
      'Rendement des céréales autoconsommées': {
        quantity: 30,
        unity: 'quintaux/ha',
      },
    },
  },
  bloc6: {
    label: 'Les intrants utilisés par le troupeau (bovin lait et bovin viande)',
    content: {
      'Azote minéral utilisé': { quantity: 0, untity: 'UN/an' },
      'Aliments achetés (céréales, tourteaux, aliments composés, CMV…)': {
        quantity: 21,
        untity: 'tonnes brutes/an',
      },
      'Dont tourteaux de soja': { quantity: 0, untity: 'tonnes brutes/an' },
    },
  },
  bloc7: {
    label: 'Les intrants utilisés par le troupeau bovin lait ',
    content: {
      "Consommation d'électricité": { quantity: 0, unity: 'kWh/an' },
      'Consommation de carburants': { quantity: 8285, unity: 'litres/an' },
      'Azote organique importé': { quantity: 0, unity: 'UN/an' },
    },
  },
  bloc8: {
    label: 'Le troupeau bovin viande',
    content: {
      'BL/BV': 'BL',
      "Type d'atelier": 'Naisseur - engraisseur ',
      "Nombre moyen de vaches allaitantes sur l'année": {
        quantity: 0,
        unity: 'têtes',
      },
      'Génisses 0-1 an': { quantity: 0, unity: 'têtes' },
      'Génisses 1-2 ans ': { quantity: 0, unity: 'têtes' },
      'Génisses >2ans': { quantity: 0, unity: 'têtes' },
      'Mâle 0-1 an': { quantity: 0, unity: 'têtes' },
      'Mâle 1-2 ans': { quantity: 0, unity: 'têtes' },
      'Mâle  >2 ans': { quantity: 0, unity: 'têtes' },
      'Temps moyen passé au bâtiment pour les vaches et les génisses': {
        quantity: 0,
        unity: 'mois/an',
      },
      'Temps moyen passé au bâtiment pour les mâles': {
        quantity: 0,
        unity: 'mois/an',
      },
      'Mode de logement majoritaire du troupeau viande': 'Aire paillée intégrale',
      "Poids des vaches de réforme à l'abattage": {
        quantity: 450,
        unity: 'Kg carcasse/ tete',
      },
      'Quantité de viande vendu': { quantity: 89900, unity: 'Kg vif ' },
      'Dont quantité de viande maigre vendue': {
        quantity: 0,
        unity: 'Kg vif ',
      },
      'Dont quantité de viande finie vendue': {
        quantity: 89900,
        unity: 'Kg vif ',
      },
      'Poids total des animaux achetés ': { quantity: 0, unity: 'Kg vif ' },
      "Variation d'inventaire": { quantity: 0, unity: 'Kg vif ' },
      'Production brute de viande': { quantity: 0, unity: 'Kg vif ' },
    },
  },
  bloc9: {
    label: 'Les surfaces liées au troupeau bovin viande',
    content: {
      'Azote organique exporté': { quantity: 0, unity: 'UN/an' },
      'Céréales autoconsommées - Quantités': {
        quantity: 0,
        unity: 'tonnes brutes/an',
      },
      'Rendement des céréales autoconsommées': {
        quantity: 0,
        unity: 'quintaux/ha',
      },
    },
  },
  bloc10: {
    label: 'Les intrants utilisés par le troupeau bovin viande',
    content: {
      "Consommation d'électricité": { quantity: 0, unity: 'kWh/an' },
      'Consommation de carburants': { quantity: 0, unity: 'litres/an' },
      'Azote organique importé': { quantity: 0, unity: 'UN/an' },
    },
  },
}
