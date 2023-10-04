// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Privatar {

    struct Profile {
        string name;
        string note;
        /// @notice base64 encoded image.
        string avatar;
        bool enabled;
    }

    mapping(address => Profile) private _profiles;

    /// @notice If a profile is disabled, access is denied unless you're the profile owner.
    modifier profileEnabledOrProfileOwner (address addr) {
        require(msg.sender == addr || _profiles[addr].enabled, "Access denied");
        _;
    }

    function getAvatar(address addr) external view profileEnabledOrProfileOwner(addr) returns (string memory) {
        return _profiles[addr].avatar;
    }

    function getProfile(address addr) external view profileEnabledOrProfileOwner(addr) returns (Profile memory) {
        return _profiles[addr];
    }

    function updateProfile(string calldata name, string calldata note, string calldata avatar, bool enabled) external {
        Profile memory profile;
        profile.name = name;
        profile.note = note;
        profile.avatar = avatar;
        profile.enabled = enabled;

        _profiles[msg.sender] = profile;
    }

}