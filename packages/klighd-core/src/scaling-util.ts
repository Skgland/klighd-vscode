import { Bounds, Dimension } from 'sprotty-protocol'

export function maxParentScale(node: Bounds, parent: Bounds): number {
    // the maximum scale that keeps the node in bounds height wise
    const maxHeightScale = parent.height / node.height
    // the maximum scale that keeps the node in bounds width wise
    const maxWidthScale = parent.width / node.width

    return Math.min(maxHeightScale, maxWidthScale)
}


function inverseScaleDimension(offset_a: number, length_a: number, offset_b: number, length_b: number, available: number): number {
    // we want to find positive scale so that
    // result_a = scaleDimension(offset_a, length_a, available, scale)
    // result_b = scaleDimension(offset_b, length_b, available, scale)
    // result_a.offset = result_b.offset + result_b.length
    // || result_b.offset = result_a.offset + result_a.length

    const fa = (offset_a * length_a) / (available - length_a)
    const fb = (offset_b * length_b) / (available - length_b)

    const numerator = offset_a + fa - offset_b - fb

    const result_1 =  numerator / (fa - fb + length_b)
    const result_2 = -numerator / (fb - fa + length_a)

    // the scale should be at least one and at most one of the results should be positive
    return Math.max(result_1, result_2, 1)
}

export function maxSiblingScale(node: Bounds, parent:Bounds, sibling: Bounds) : number {

    // calculate the scale for each dimension at which we reach our sibling
    const result_1 = inverseScaleDimension(node.x, node.width, sibling.x, sibling.width, parent.width)
    const result_2 = inverseScaleDimension(node.y, node.height, sibling.y, sibling.height, parent.height)

    // take the max as that which ever is further is relevant for bounding us, but should be at least 1
    return Math.max(result_1, result_2, 1)
}

export function calculateScaledBounds(originalBounds: Bounds, availableSpace: Dimension, scale: number) : Bounds {
    const originalWidth = originalBounds.width
    const originalHeight = originalBounds.height
    const originalX = originalBounds.x
    const originalY = originalBounds.y

    // Calculate the new x and y indentation:
    // width required of scaled rendering
    const {length: newWidth, offset: newX} = scaleDimension(originalX, originalWidth, availableSpace.width, scale)

    // Same for y axis, just with switched dimensional variables.
    const {length: newHeight, offset: newY} = scaleDimension(originalY, originalHeight, availableSpace.height, scale)
    return {x: newX, y : newY, width: newWidth, height: newHeight}
}

export function scaleDimension(offset: number, length: number, available: number, scale: number) : {offset:number, length:number}{
    const newLength = length * scale;
    const prefix = offset
    const postfix = available - offset - length
    const newOffset = offset - prefix * (newLength - length) / (prefix + postfix)
    return {offset: newOffset, length: newLength}
}

export function upscaleBounds(effectiveScale: number, maxScale: number, childBounds: Bounds, parentBounds: Bounds, siblings: Bounds[] = []) : {bounds: Bounds, scale: number} {

  // we want that the effectiveScale * desiredScale = maxScale
  // so that the we effectively up scale to maxScale
  const desiredScale = maxScale / effectiveScale;

  // the maximum scale at which the child still fits into the parent
  const parentScaling = maxParentScale(childBounds, parentBounds)

  // some maximum scale at which the child does not interfere with its siblings
  const siblingScaling = siblings.map((siblingBounds) => maxSiblingScale(childBounds, parentBounds, siblingBounds))

  // the most restrictive scale between our desired scale and the maximum imposed by the parent and siblings
  const preferredScale = Math.min(desiredScale, parentScaling, ...siblingScaling)

  // we never want to shrink, should only be relevant if our desired scale is less than 1
  const scalingFactor = Math.max(1, preferredScale)

  const newBounds = calculateScaledBounds(childBounds, parentBounds, scalingFactor)

  return {bounds:newBounds, scale: scalingFactor}
}