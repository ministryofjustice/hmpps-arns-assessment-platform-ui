import { NodeId } from '@form-engine/core/types/engine.type'
import ThunkBaseError from './ThunkBaseError'

export default class ThunkSecurityError extends ThunkBaseError {
  static dangerousProperty(nodeId: NodeId, propertyName: string, pseudoNodeType?: string): ThunkSecurityError {
    const typeInfo = pseudoNodeType ? ` in ${pseudoNodeType}` : ''

    return new ThunkSecurityError(
      'SECURITY',
      nodeId,
      `Dangerous property name detected: "${propertyName}"${typeInfo}`,
      {
        Property: propertyName,
        'Pseudo Type': pseudoNodeType,
      },
    )
  }
}
