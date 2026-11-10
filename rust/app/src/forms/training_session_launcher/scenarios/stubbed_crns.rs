//! CRNs Wiremock answers for in local, dev and test instead of the
//! real APIs. Everyone shares them, so the launcher never registers its own stubs for them.

pub struct StubbedCrn {
    pub crn: &'static str,
    pub description: &'static str,
}

pub const STUBBED_CRNS: [StubbedCrn; 7] = [
    StubbedCrn { crn: "X444444", description: "Tier B confirmed. Standard supervision phase, early engagement complete." },
    StubbedCrn { crn: "X222222", description: "Tier B confirmed. Standard supervision phase, no appointments booked." },
    StubbedCrn { crn: "X333333", description: "Tier B confirmed. In breach, on the OPD pathway." },
    StubbedCrn { crn: "X666666", description: "Tier and supervision package both unavailable (server error)." },
    StubbedCrn { crn: "X888888", description: "Tier B confirmed. No supervision package." },
    StubbedCrn { crn: "X555555", description: "Tier C provisional. In-flight case, OASys review not started." },
    StubbedCrn { crn: "X111111", description: "Tier B confirmed. In-flight case, OASys review started but not finished." },
];

pub fn is_stubbed_crn(crn: &str) -> bool {
    STUBBED_CRNS.iter().any(|s| s.crn == crn)
}
