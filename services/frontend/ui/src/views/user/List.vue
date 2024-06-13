<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      sort-by="email"
    >
      <template v-slot:top>
        <v-toolbar
          color="white"
          flat
        >
          <v-toolbar-title>{{ $t('user.list.title') }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            max-width="500px"
            v-model="dialog"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                outlined
                v-on="on"
              >
                {{ $t('user.list.btn_add') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-text-field
                        :label="$t('user.modal.username')"
                        v-model="editedItem.username"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-text-field
                        :label="$t('user.modal.email')"
                        v-model="editedItem.email"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-text-field
                        :label="$t('user.modal.password')"
                        v-model="editedItem.password"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-select
                        v-model="editedItem.authorization"
                        :items="authorizationList"
                        item-text="name"
                        item-value="id"
                        :label="$t('user.modal.authorization')"
                        :value-comparator="compareAuthorization"
                        required
                        clearable
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="close"
                  color="grey"
                  text
                >
                  {{ $t('btn.cancel') }}
                </v-btn>
                <v-btn
                  @click="save"
                  color="primary"
                  outlined
                >
                  {{ $t('btn.save') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          @click="editItem(item)"
          class="mr-2"
          small
        >
          mdi-pencil
        </v-icon>
        <v-icon
          @click="deleteItem(item)"
          small
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          @click="initialize"
          color="primary"
        >
          {{ $t('btn.reset') }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  import axios from '@plugins/axios'
  import { mapState } from 'vuex'

  // TODO-FRONT add role
  export default {
    name: 'UserList',
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        email: '',
        password: '',
        authorization: null,
      },
      defaultItem: {
        username: '',
        email: '',
        password: '',
        authorization: null,
      },
    }),

    computed: {
      ...mapState('user', {
        authorizationList: (state) => state.authorizations,
      }),

      formTitle() {
        return this.editedIndex === -1
          ? this.$t('user.modal.new')
          : this.$t('user.modal.edit', { name: this.editedItem.username })
      },
    },

    watch: {
      dialog(val) {
        val || this.close()
      },
    },

    created() {
      this.initialize()
    },

    methods: {
      initialize() {
        this.$store.dispatch('user/fetchAuthorizationList')
        axios.get('/users').then((resp) => {
          this.users = resp.data
        })
      },
      compareAuthorization(a, b) {
        console.log('compare', a, b)
      },

      editItem(item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log('edited item', this.editedItem)
        this.dialog = true
      },

      deleteItem(item) {
        var deletedIndex = this.users.indexOf(item)
        deletedIndex = Object.assign({}, item)
        confirm('Are you sure you want to delete this item?') &&
          axios({
            url: '/users/' + deletedIndex.id,
            method: 'Delete',
          })
            .then((resp) => {
              this.initialize()
            })
            .catch((err) => {
              console.error(err)
            })
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          console.log('save', this.editedItem)
          axios({
            url: '/users/' + this.editedItem.id,
            data: this.editedItem,
            method: 'PUT',
          })
            .then((resp) => {
              this.initialize()
            })
            .catch((err) => {
              console.error(err)
            })
          // Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          const userData = {
            email: this.editedItem.email,
            username: this.editedItem.username,
            authorization: this.editedItem.authorization,
            password: this.editedItem.password,
          }
          axios({
            url: '/users',
            data: userData,
            method: 'POST',
          })
            .then((resp) => {
              this.initialize()
            })
            .catch((err) => {
              console.error(err)
            })
        }
        this.close()
      },
    },
  }
</script>

<style scoped></style>
