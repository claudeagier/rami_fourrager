<template>
  <div>
    <v-btn
      color="primary"
      @click="exportToPDF"
    >
      Exporter en PDF
    </v-btn>
    <!-- Overlay pour griser la fenêtre -->
    <v-overlay
      :value="loading"
      absolute
      class="global-overlay"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
  import jsPDF from 'jspdf'
  import html2canvas from 'html2canvas'

  export default {
    name: 'pretty-print',
    data() {
      return {
        loading: false,
      }
    },
    methods: {
      async exportToPDF() {
        this.loading = true
        try {
          const element = document.getElementById('printable-area') // Remplacez par l'ID de votre conteneur

          // Capture l'élément avec html2canvas
          const canvas = await html2canvas(element, {
            scale: 5, // Améliore la qualité de l'image
            useCORS: true, // Pour charger des images externes si nécessaire
          })
          console.log('ici')

          const imgData = canvas.toDataURL('image/png') // Convertir en base64
          // eslint-disable-next-line no-use-before-define
          /* prettier-ignore */
          const pdf = new jsPDF({
            orientation: 'landscape',
            // orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          })

          const pageWidth = pdf.internal.pageSize.getWidth()
          const pageHeight = pdf.internal.pageSize.getHeight()

          const canvasWidth = canvas.width
          const canvasHeight = canvas.height

          const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight)
          const imgWidth = canvasWidth * ratio
          const imgHeight = canvasHeight * ratio

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

          // Au lieu de sauvegarder, créer un blob pour afficher dans le navigateur
          const pdfBlob = pdf.output('blob')

          // Créer une URL pour le blob et ouvrir dans un nouvel onglet
          const url = URL.createObjectURL(pdfBlob)
          window.open(url)

          // pdf.save('rapport.pdf')
        } catch (error) {
          console.error('Erreur lors de la génération du PDF :', error)
        } finally {
          this.loading = false // Désactiver l'overlay à la fin du téléchargement
        }
      },
    },
  }
</script>
<style scoped></style>
