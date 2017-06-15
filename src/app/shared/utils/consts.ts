import * as L from 'leaflet';

export let WA_CENTER: L.LatLng = L.latLng([-27, 121]);

export let DATASET_TYPE_MAP: any = {
    generic: 'Generic Record',
    observation: 'Observation',
    species_observation: 'Species Observation'
};

export function getDefaultBaseLayer(): L.TileLayer {
    return L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Open Street Map'
    });
}

export function getOverlayLayers(): any {
    return {
        'WA Townsites': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:townsite_poly',
            format: 'image/png',
            transparent: true,
        }),
        'P&W Estate': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:dpaw_tenure',
            format: 'image/png',
            transparent: true,
        }),
        'DPaW District Boundaries': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:dpaw_districts',
            format: 'image/png',
            transparent: true,
        }),
        'DPaW Region Boundaries': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:dpaw_regions',
            format: 'image/png',
            transparent: true,
        }),
        'Interim Biogeographic Regionalisation for WA': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:ibra_wa_subregions',
            format: 'image/png',
            transparent: true,
        }),
        'Scientific Study Sites': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:scientific_study_sites',
            format: 'image/png',
            transparent: true,
        }),
        'Pre-European Vegetation': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:pre_european',
            format: 'image/png',
            transparent: true,
        }),
        'Auslig 250K': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:auslig_cddp',
            format: 'image/png',
            transparent: true,
        }),
        'Road Centrelines': L.tileLayer.wms('https://kmi.dpaw.wa.gov.au/geoserver/cddp/wms', {
            layers: 'cddp:road_centrelines',
            format: 'image/png',
            transparent: true,
        })
    };
}
