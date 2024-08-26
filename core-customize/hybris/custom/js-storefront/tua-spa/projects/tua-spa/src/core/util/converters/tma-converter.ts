// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export abstract class TmaConverter<S, T> {

    /**
     * Converts a given source to a specified target
     *
     * @param source - given source
     * @return Specified target
     */
    abstract convertSourceToTarget(source: S): T;

    /**
     * Converts a given target to a specified source
     *
     * @param target - given target
     * @returns Specified source
     */
    abstract convertTargetToSource(target: T): S;
  }
