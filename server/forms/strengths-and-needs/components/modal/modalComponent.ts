import {buildNunjucksComponent} from "@ministryofjustice/hmpps-forge/express-nunjucks";
import {block as buildBlock,} from '@ministryofjustice/hmpps-forge/core/authoring'
import {BasicBlockProps, BlockDefinition, ResolvableString} from "@ministryofjustice/hmpps-forge/core/components";

export interface ModalProps extends BasicBlockProps {
  /** The card's heading. */
  id: ResolvableString
  /** The card's heading. */
  title: ResolvableString
  /** Body text shown below the heading. */
  buttonText: ResolvableString
}

export interface Modal extends BlockDefinition, ModalProps {
  variant: 'modal'
}

export function Modal(props: ModalProps): Modal {
  return buildBlock<Modal>({ ...props, variant: 'modal' })
}

export const modalComponent =
  buildNunjucksComponent<Modal>('modal', (block, nunjucksEnv) => {
  return nunjucksEnv.render('strengths-and-needs/components/modal/modal.njk', {
    params: {
      id: block.id,
      title: block.title,
      button: block.buttonText
    },
  })
})
