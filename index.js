const db = firebase.firestore();
const ticketsRef = db.collection('tickets');

Vue.component('ticket', {
  props: ['ticket'],
  template: `<div @click="confirm" class="ticket"><img :src="getImg"><div><p>高級<span class="focus">{{ticket.name}}</span>按摩券 編號<span class="focus">{{ticket.number}}</span></p></div></div>`,
  computed: {
    getImg() {
      if (this.ticket.name == '馨怡') {
        return `./assets/nope_sis.jpg`
      } else {
        return `./assets/nope.jpg`
      }
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.ticket)
    }
  }
})

let app = new Vue({
  el: '#app',
  data: {
    tiffTickets: [],
    claireTickets: [],
    selectedPerson: 'tiff',
    alert: '',
    selected: false,
    selectedTicket: null
  },
  methods: {
    togglePerson() {
      if (this.selectedPerson == 'tiff') {
        this.selectedPerson = 'claire'
      } else {
        this.selectedPerson = 'tiff'
      }
    },
    confirm(ticket) {
      this.selected = true;
      this.selectedTicket = ticket;
      this.alert = `確定要使用高級${ticket.name}按摩券編號${ticket.number}嗎？`
    },
    use() {
      ticketsRef.where('name', '==', this.selectedTicket.name).where('number', '==', this.selectedTicket.number).get().then(q => {
        let id = q.docs.map(doc=>doc.id)[0];
        ticketsRef.doc(id).update({isUsed: true});
        alert(`恭喜您使用使用高級${this.selectedTicket.name}按摩券編號${this.selectedTicket.number}!`);
        this.selected = false;
        this.selectedTicket = null
      })
    },
    cancel() {
      this.selected = false;
      this.selectedTicket = null
    }
  },
  mounted() {
    ticketsRef.where('isUsed', '==', false).where('name', '==','馨怡').orderBy('number', 'asc').onSnapshot(querySnap => {
      this.tiffTickets = querySnap.docs.map(doc => doc.data())
    });
    ticketsRef.where('isUsed', '==', false).where('name', '==','馨柔').orderBy('number', 'asc').onSnapshot(querySnap => {
      this.claireTickets = querySnap.docs.map(doc => doc.data())
    })
  }
})