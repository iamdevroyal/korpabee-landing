import { computed } from 'vue'
import { useCvBuilderStore } from '../stores/cvBuilder.js'

/**
 * Thin orchestration composable — components call this, never the store directly.
 * Keeps wizard components declarative and polling/sequencing logic in one place.
 */
export function useCvBuilder() {
  const store = useCvBuilderStore()

  // Restore persisted formData + selectedTemplateId from localStorage on first use
  store.$init()

  /**
   * Full generation pipeline:
   *  1. POST draft (fires StructureCvDraftJob via event)
   *  2. Poll until draft.status === 'structured'
   *  3. POST generate (dispatches RenderCvDocumentJob)
   *  4. Poll until generatedCv.status === 'completed' | 'failed'
   */
  const runFullGeneration = async () => {
    const draft = await store.submitDraft()
    await store.pollDraftUntilStructured(draft.id)
    await store.generate()
  }

  return {
    templates:          computed(() => store.templates),
    selectedTemplateId: computed(() => store.selectedTemplateId),
    formData:           computed(() => store.formData),
    status:             computed(() => store.status),
    isProcessing:       computed(() => store.isProcessing),
    errorMessage:       computed(() => store.errorMessage),
    generatedCv:        computed(() => store.generatedCv),
    templatesLoading:   computed(() => store.status === 'loading_templates'),

    loadTemplates:  store.loadTemplates,
    selectTemplate: store.selectTemplate,
    updateFormData: store.updateFormData,
    runFullGeneration,
    reset:          store.reset,
    resetAll:       store.resetAll,
  }
}
