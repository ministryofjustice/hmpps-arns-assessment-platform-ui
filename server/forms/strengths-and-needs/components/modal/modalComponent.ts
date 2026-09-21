import { buildNunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { block as buildBlock } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  BasicBlockProps,
  BlockDefinition,
  EvaluatedBlock,
  ResolvableString,
} from '@ministryofjustice/hmpps-forge/core/components'

export interface ModalProps extends BasicBlockProps {
  id: ResolvableString
  title: ResolvableString
  buttonText: ResolvableString
}

export interface Modal extends BlockDefinition, ModalProps {
  variant: 'modal'
}

export function Modal(props: ModalProps): Modal {
  return buildBlock<Modal>({ ...props, variant: 'modal' })
}

export const modalComponent = buildNunjucksComponent<Modal>('modal', (block: EvaluatedBlock<Modal>, nunjucksEnv) => {
  return nunjucksEnv.render('strengths-and-needs/components/modal/modal.njk', {
    id: block.id,
    title: block.title,
    buttonText: block.buttonText,
  })
})
