//! Access form: unified entry points for OASys handover and CRN-based
//! access to the target services.
//!
//! Routes:
//! - `/access/:service/oasys` - OASys handover entry point
//! - `/access/:service/crn/:crn` - CRN-based access entry point
//!
//! After processing, both redirect to the target service's entry path.

pub mod effects;
pub mod registry;

use std::sync::Arc;

use forge_core::ForgePackage;

use crate::effect;
use crate::forms::dsl::*;

pub use effects::AccessEffectsDeps;

/// OASys access entry point: loads the handover context, then sets case, practitioner and
/// access details from it.
pub fn oasys_access_step() -> Value {
    step(obj! {
        "path": "/:service/oasys",
        "title": "OASys Access",
        "reachability": obj! { "entryWhen": true },
        "onAccess": [access(obj! {
            "effects": [
                effect!("clearAccessSession"),
                effect!("setTargetServiceAndRedirect"),
                effect!("loadHandoverContext"),
                effect!("setCaseDetailsFromHandoverContext"),
                effect!("setPractitionerDetailsFromHandoverContext"),
                effect!("setAccessDetailsFromHandoverContext"),
            ],
            "next": [redirect(obj! { "goto": data("redirectPath") })],
        })],
    })
}

/// CRN access entry point: case details from Delius, practitioner details from HMPPS Auth.
pub fn crn_access_step() -> Value {
    step(obj! {
        "path": "/:service/crn/:crn",
        "title": "CRN Access",
        "reachability": obj! { "entryWhen": true },
        "onAccess": [access(obj! {
            "effects": [
                effect!("clearAccessSession"),
                effect!("setTargetServiceAndRedirect"),
                effect!("setCaseDetailsFromCrn"),
                effect!("setPractitionerDetailsFromAuth"),
                effect!("setAccessDetailsForCrn"),
            ],
            "next": [redirect(obj! { "goto": data("redirectPath") })],
        })],
    })
}

pub fn access_journey() -> Value {
    journey(obj! {
        "code": "access",
        "title": "Access",
        "path": "/access",
        "steps": [oasys_access_step(), crn_access_step()],
    })
}

pub fn package(deps: Arc<AccessEffectsDeps>) -> ForgePackage {
    ForgePackage::new(access_journey()).with_functions(effects::access_effects(&deps))
}
