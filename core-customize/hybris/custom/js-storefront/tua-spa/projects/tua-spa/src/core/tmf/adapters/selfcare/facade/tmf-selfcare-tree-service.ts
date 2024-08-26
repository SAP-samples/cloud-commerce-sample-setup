// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TmaSubscriptions, TmaSubscriptionsTreeNode, TREE_TOGGLE } from '../../../../model';

/**
 * Service to populate Subscriptions data to `Table` data.
 * data is driven by the table configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class TmfSelfcareTreeService {
  /**
   * Indicates the minimum number of (initial) expanded units.
   */
  protected minimalExpanded = 1;

  protected globalToggle$: BehaviorSubject<TREE_TOGGLE> = new BehaviorSubject(
    undefined
  );

  treeToggle$: BehaviorSubject<Map<string, TREE_TOGGLE>> = new BehaviorSubject(
    new Map()
  );

  /**
   * Initializes the tree with an active product.
   *
   * The active product will be collapsed.
   */
  initialize(root: TmaSubscriptions, activeId: string): void {
    if (activeId) {
      this.expandUntilActiveNode(root, activeId);
    }
  }

  /**
   * Sets the global toggle state to _collapsed_ and clears the toggle state
   * for individual units.
   */
  collapseAll() {
    this.globalToggle$.next(TREE_TOGGLE.COLLAPSED);
    this.treeToggle$.next(new Map());
  }

  /**
   * Sets the global toggle state to _expanded_ and clears the toggle state
   * for individual units.
   */
  expandAll() {
    this.globalToggle$.next(TREE_TOGGLE.EXPANDED);
    this.treeToggle$.next(new Map());
  }

  /**
   * Indicates whether the give product is expanded.
   *
   * The returned (boolean) expand state is driven by the global toggle
   * state (expand / collapse all) and the toggle state for individual products.
   * There's also the `minimalExpanded` taken into consideration.
   */
  isExpanded(productId: string, level: number): boolean {
    const toggleState = this.treeToggle$.value?.get(productId);

    if (
      this.globalToggle$.value === TREE_TOGGLE.COLLAPSED &&
      toggleState !== TREE_TOGGLE.EXPANDED
    ) {
      return false;
    }

    return (
      // the current node is expanded
      toggleState === TREE_TOGGLE.EXPANDED ||
      // the node is not collapsed, but globally expanded ("expand all") or above
      // the minimum visible nodes
      ((this.globalToggle$.value === TREE_TOGGLE.EXPANDED ||
        level < this.minimalExpanded) &&
        toggleState !== TREE_TOGGLE.COLLAPSED)
    );
  }

  toggle(product: TmaSubscriptionsTreeNode) {
    const currentState = this.treeToggle$.value;
    currentState.set(
      product.id,
      this.isExpanded(product.id, product.depthLevel)
        ? TREE_TOGGLE.COLLAPSED
        : TREE_TOGGLE.EXPANDED
    );
    this.treeToggle$.next(currentState);
  }

  /**
   * Expands all tree nodes till the active unit, to ensure that the
   * full tree is collapsed till the active item.
   *
   * This is useful while navigating the tree by the router.
   */
  protected expandUntilActiveNode(
    node: TmaSubscriptions,
    activeUnitId: string
  ) {
    const hasActiveChild = (n: any, id: string): boolean =>
      !!n.product.find(
        (child: TmaSubscriptionsTreeNode) =>
          child.id === id || hasActiveChild(child, id)
      );

    const findInvolvedTreeNodes = (n: any, activeItems = []): string[] => {
      if (hasActiveChild(n, activeUnitId)) {
        activeItems.push(n.id);
      }
      n.product.forEach((child) => {
        findInvolvedTreeNodes(child, activeItems);
      });
      return activeItems;
    };

    const m = this.treeToggle$.value;
    findInvolvedTreeNodes(node).forEach((activeId) => {
      if (m.get(activeId) !== TREE_TOGGLE.EXPANDED) {
        m.set(activeId, TREE_TOGGLE.EXPANDED);
      }
    });
    if (m !== this.treeToggle$.value) {
      this.treeToggle$.next(m);
    }
  }
}
