import { nunjucksComponent } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { block as buildBlock } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BasicBlockProps, BlockDefinition, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

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

export const modalComponent = nunjucksComponent<Modal>('modal', {
  render: (props, nunjucksEnv) => {
    return nunjucksEnv.render('strengths-and-needs/components/modal/modal.njk', {
      id: props.id,
      title: props.title,
      buttonText: props.buttonText,
    })
  },
})
