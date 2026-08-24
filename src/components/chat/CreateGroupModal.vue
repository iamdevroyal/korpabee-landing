<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">Create New Group</h2>
          <button class="modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Group Name -->
          <div class="field">
            <label class="field-label">Group Name <span class="required">*</span></label>
            <input
              v-model="form.name"
              class="field-input"
              type="text"
              placeholder="e.g. Study Squad 📚"
              maxlength="100"
            />
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field-label">Description <span class="optional">(optional)</span></label>
            <textarea
              v-model="form.description"
              class="field-textarea"
              placeholder="What's this group about?"
              rows="2"
              maxlength="300"
            />
          </div>

          <!-- Member picker -->
          <div class="field">
            <label class="field-label">
              Add Members
              <span v-if="selectedIds.length" class="optional">({{ selectedIds.length }} selected)</span>
            </label>

            <!-- Loading state -->
            <div v-if="loadingConnections" class="connections-loader">
              <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:.15"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity:.75"/>
              </svg>
              <span>Loading your connections…</span>
            </div>

            <!-- No connections yet -->
            <div v-else-if="!allConnections.length" class="no-connections">
              <div class="no-connections-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M9 7a4 4 0 100 8 4 4 0 000-8M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <p>You have no connections yet.</p>
              <p class="no-connections-hint">
                Add connections first to invite them to a group.
                <router-link to="/discover" class="no-connections-link" @click="$emit('close')">
                  Discover people →
                </router-link>
              </p>
            </div>

            <!-- Has connections -->
            <template v-else>
              <!-- Filter search (client-side only) -->
              <div class="member-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  v-model="memberSearch"
                  class="member-search-input"
                  type="text"
                  placeholder="Filter connections…"
                />
                <button v-if="memberSearch" class="search-clear" @click="memberSearch = ''">×</button>
              </div>

              <!-- Selected chips -->
              <div v-if="selectedMembers.length" class="selected-chips">
                <span
                  v-for="m in selectedMembers"
                  :key="m.uuid"
                  class="chip"
                >
                  <span class="chip-avatar">{{ m.name?.[0] }}</span>
                  {{ m.name.split(' ')[0] }}
                  <button @click="removeMember(m.uuid)" class="chip-remove">×</button>
                </span>
              </div>

              <!-- Connections list -->
              <div class="member-list" v-if="filteredConnections.length">
                <button
                  v-for="conn in filteredConnections"
                  :key="conn.uuid"
                  class="member-row"
                  :class="{ 'member-row--selected': selectedIds.includes(conn.uuid) }"
                  @click="toggleMember(conn)"
                  type="button"
                >
                  <div class="member-avatar" :style="!conn.avatar ? avatarGradient(conn) : null">
                    <img v-if="conn.avatar" :src="conn.avatar" :alt="conn.name" />
                    <span v-else>{{ conn.name?.[0] }}</span>
                  </div>
                  <div class="member-info">
                    <p class="member-name">{{ conn.name }}</p>
                    <p class="member-sub">{{ conn.username ? '@' + conn.username : 'Corps Member' }}</p>
                  </div>
                  <div class="member-check" :class="{ 'member-check--active': selectedIds.includes(conn.uuid) }">
                    <svg v-if="selectedIds.includes(conn.uuid)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                </button>
              </div>

              <p v-else class="no-results">
                No connections match "<strong>{{ memberSearch }}</strong>"
              </p>
            </template>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancel</button>
          <button
            class="btn-create"
            :disabled="!form.name.trim() || creating"
            @click="submit"
          >
            <svg v-if="creating" class="btn-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            {{ creating ? 'Creating…' : 'Create Group' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChat } from '@/composables/useChat'
import { useConnectionsStore } from '@/stores/connections'

const props = defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'created'])
const router = useRouter()
const { createGroup } = useChat()
const connectionsStore = useConnectionsStore()

const form            = ref({ name: '', description: '' })
const memberSearch    = ref('')
const selectedIds     = ref([])
const selectedMembers = ref([])
const creating        = ref(false)

// Use the store's connections list directly — already loaded by the app
const allConnections     = computed(() => connectionsStore.connections)
const loadingConnections = computed(() => connectionsStore.loadingConnections)

const filteredConnections = computed(() => {
  const q = memberSearch.value.toLowerCase().trim()
  return allConnections.value.filter(c => {
    const alreadySelected = selectedIds.value.includes(c.uuid)
    if (alreadySelected) return false
    if (!q) return true
    return c.name?.toLowerCase().includes(q) ||
           c.username?.toLowerCase().includes(q)
  })
})

const avatarGradient = (conn) => {
  const palettes = [
    ['#6C5CE7', '#a29bfe'],
    ['#00b894', '#55efc4'],
    ['#e17055', '#fab1a0'],
    ['#0984e3', '#74b9ff'],
    ['#d63031', '#ff7675'],
  ]
  const idx = (conn.name || '').charCodeAt(0) % palettes.length
  const [from, to] = palettes[idx]
  return { background: `linear-gradient(135deg, ${from}, ${to})` }
}

const toggleMember = (conn) => {
  if (selectedIds.value.includes(conn.uuid)) {
    removeMember(conn.uuid)
  } else {
    selectedIds.value.push(conn.uuid)
    selectedMembers.value.push(conn)
  }
}

const removeMember = (uuid) => {
  selectedIds.value    = selectedIds.value.filter(id => id !== uuid)
  selectedMembers.value = selectedMembers.value.filter(m => m.uuid !== uuid)
}

const submit = async () => {
  if (!form.value.name.trim() || creating.value) return
  creating.value = true
  try {
    const conversation = await createGroup({
      name:        form.value.name.trim(),
      description: form.value.description.trim() || null,
      member_ids:  selectedIds.value,
    })
    emit('created', conversation)
    emit('close')
    router.push(`/chat/${conversation.uuid}`)
  } catch (err) {
    console.error('[CreateGroupModal] Failed:', err)
  } finally {
    creating.value = false
  }
}

// Fetch connections when modal opens if not already loaded
watch(() => props.show, async (open) => {
  if (!open) {
    // Reset form on close
    form.value    = { name: '', description: '' }
    memberSearch.value = ''
    selectedIds.value  = []
    selectedMembers.value = []
    return
  }
  // Load connections if not already loaded
  if (!allConnections.value.length && !loadingConnections.value) {
    await connectionsStore.fetchConnections(true)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 21, 53, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  animation: overlayIn 0.2s ease;
}

@keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }

.modal-panel {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 20px 20px 0 0;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }

@media (min-width: 600px) {
  .modal-overlay { align-items: center; padding: 24px; }
  .modal-panel { border-radius: 20px; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #F0EEFF;
  flex-shrink: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #1A1535;
}

.modal-close {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #F0EEFF;
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6C5CE7;
  transition: background 0.15s;
}
.modal-close:hover { background: #6C5CE7; color: #fff; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  scrollbar-width: thin;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #3D3568;
}

.required { color: #e53e3e; }
.optional { color: #A8A4C4; font-weight: 400; }

.field-input,
.field-textarea {
  padding: 10px 12px;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  font-size: 13px;
  color: #1A1535;
  outline: none;
  resize: none;
  background: #F8F7FF;
  transition: border-color 0.2s;
  font-family: inherit;
}
.field-input:focus,
.field-textarea:focus { border-color: #6C5CE7; background: #fff; }

/* Loading */
.connections-loader {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: #A8A4C4;
  font-size: 12.5px;
}

.spin-icon {
  width: 18px; height: 18px;
  color: #6C5CE7;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

/* No connections */
.no-connections {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  text-align: center;
}

.no-connections-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #F0EEFF;
  display: flex; align-items: center; justify-content: center;
  color: #a29bfe;
}

.no-connections p {
  font-size: 13px;
  font-weight: 600;
  color: #1A1535;
  margin: 0;
}

.no-connections-hint {
  font-size: 12px !important;
  color: #A8A4C4 !important;
  font-weight: 400 !important;
}

.no-connections-link {
  color: #6C5CE7;
  font-weight: 600;
  text-decoration: none;
}
.no-connections-link:hover { text-decoration: underline; }

/* Search */
.member-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F8F7FF;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  color: #A8A4C4;
  transition: border-color 0.2s;
}
.member-search-wrap:focus-within { border-color: #a29bfe; }

.member-search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 13px;
  color: #1A1535;
}

.search-clear {
  background: none; border: none; cursor: pointer;
  color: #A8A4C4; font-size: 16px; line-height: 1;
  padding: 0; display: flex;
}
.search-clear:hover { color: #6C5CE7; }

/* Selected chips */
.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px 3px 4px;
  background: #F0EEFF;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  color: #6C5CE7;
}

.chip-avatar {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.chip-remove {
  background: none; border: none; cursor: pointer;
  color: #a29bfe; font-size: 15px; line-height: 1;
  padding: 0; display: flex; align-items: center;
}
.chip-remove:hover { color: #6C5CE7; }

/* List */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 240px;
  overflow-y: auto;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  padding: 4px;
  scrollbar-width: thin;
  scrollbar-color: #E8E4FF transparent;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
  width: 100%;
}
.member-row:hover { background: #F8F7FF; }
.member-row--selected { background: #F0EEFF !important; }

.member-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.member-avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-avatar span { font-size: 14px; font-weight: 700; color: #fff; }

.member-info { flex: 1; min-width: 0; }
.member-name { font-size: 13px; font-weight: 600; color: #1A1535; }
.member-sub  { font-size: 11px; color: #A8A4C4; }

.member-check {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid #E8E4FF;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.member-check--active {
  background: #6C5CE7;
  border-color: #6C5CE7;
  color: #fff;
}

.no-results {
  font-size: 12px;
  color: #A8A4C4;
  text-align: center;
  padding: 16px;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #F0EEFF;
  flex-shrink: 0;
}

.btn-cancel {
  flex: 1;
  padding: 11px;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  background: #F8F7FF;
  color: #6E6A8A;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { border-color: #a29bfe; color: #6C5CE7; }

.btn-create {
  flex: 2;
  padding: 11px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.btn-create:hover:not(:disabled) { opacity: 0.9; }
.btn-create:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
