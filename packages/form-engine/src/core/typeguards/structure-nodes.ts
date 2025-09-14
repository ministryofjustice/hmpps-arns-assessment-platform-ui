import { StructureType } from '@form-engine/form/types/enums'
import { BlockASTNode, JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'

// TODO: Go back and rename '___Definition' to '____Struct' as it makes way more sense
export function isJourneyStructNode(obj: any): obj is JourneyASTNode {
  return obj != null && obj.expressionType === StructureType.JOURNEY
}

export function isStepStructNode(obj: any): obj is StepASTNode {
  return obj != null && obj.expressionType === StructureType.STEP
}

export function isBlockStructNode(obj: any): obj is BlockASTNode {
  return obj != null && obj.expressionType === StructureType.BLOCK
}
