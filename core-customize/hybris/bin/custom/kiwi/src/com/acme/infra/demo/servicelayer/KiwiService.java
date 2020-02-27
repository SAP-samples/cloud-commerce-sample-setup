package com.acme.infra.demo.servicelayer;

import java.util.List;

import com.acme.infra.demo.model.InfraDemoItemModel;

/**
 * 
 */
public interface KiwiService {

    public List<InfraDemoItemModel> findInfraDemoItemByExampleNumberField(Long exampleNumberFieldValue);

}
