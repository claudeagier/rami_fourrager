<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">{{ $t('user.profile.title') }}</div>
            <div class="text-subtitle-1 font-weight-light">{{ $t('user.profile.subtitle') }}</div>
          </template>

          <v-form
            ref="userForm"
            v-model="valid"
            @submit.prevent="save"
            lazy-validation
          >
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="editedUser.firstname"
                    :label="$t('user.profile.firstname')"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="editedUser.lastname"
                    :label="$t('user.profile.lastname')"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="editedUser.username"
                    class="purple-input"
                    :label="$t('user.profile.username')"
                    required
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="editedUser.email"
                    :label="$t('user.profile.email')"
                    class="purple-input"
                    required
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="editedUser.authorization.name"
                    :label="$t('user.profile.authorization')"
                    class="purple-input"
                    disabled
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="editedUser.password"
                    :label="$t('user.profile.password')"
                    class="purple-input"
                  />
                </v-col>
                <!--
                <v-col cols="12">
                  <v-text-field
                    label="Adress"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="City"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Country"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="Postal Code"
                    type="number"
                    min="0"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col> -->

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    type="submit"
                    :disabled="!valid"
                  >
                    {{ $t('btn.save') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <!-- <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          avatar=""
        >
          <v-card-text class="text-center">
            <h6 class="text-h4 mb-1 grey--text">CEO / CO-FOUNDER</h6>

            <h4 class="text-h3 font-weight-light mb-3 black--text">Alec Thompson</h4>

            <p class="font-weight-light grey--text">
              Don't be scared of the truth because we need to restart the human foundation in truth And I love you like
              Kanye loves Kanye I love Rick Owens’ bed design but the back is...
            </p>

            <v-btn
              color="success"
              rounded
              class="mr-0"
            >
              Follow
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deepCopy } from '@/plugins/utils'
  export default {
    //
    data() {
      return {
        valid: true,
        editedUser: {},
        rules: {
          required: (value) => !!value || this.$t('validation.required'),
          number: (value) => (!isNaN(value) && isFinite(value)) || this.$t('validation.number'),
        },
      }
    },
    created() {
      this.editedUser = deepCopy(this.user)
    },
    computed: {
      ...mapGetters('auth', { user: 'getUser' }),
    },
    methods: {
      save() {
        if (this.$refs.userForm.validate()) {
          this.$store
            .dispatch('user/updateUser', this.editedUser)
            .then(() => {
              this.$toast({
                message: this.$t('notifications.users.profile.update.success'),
                type: 'success',
                timeout: 3000,
              })
            })
            .catch((err) => {
              this.$toast({
                message: this.$st('notifications.users.profile.update.error', { msg: err }),
                type: 'error',
                timeout: 5000,
              })
            })
        } else {
        }
      },
    },
  }
</script>
