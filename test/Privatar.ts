import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";

  describe("Privatar", function () {

    async function deployPrivatarFixture() {

      const [account, accountTwo] = await ethers.getSigners();
  
      const Privatar = await ethers.getContractFactory("Privatar");
      const privatar = await Privatar.deploy();
  
      return { privatar, account, accountTwo };
    }
  
    describe("Updating profiles", () => {

        it("Should set the right values on a new profile", async () => {
           const { privatar, account } = await loadFixture(deployPrivatarFixture);
   
           await privatar.connect(account).updateProfile("Alice", "A real cool gal.", "", true);
           
           const profile = await privatar.getProfile(account.address);
           expect(profile).to.deep.equal(["Alice", "A real cool gal.", "", true]);
         });   
    });

    describe("Querying profiles", () => {

        it("Should fail if a profile doesn't exist", async () => {
            const { privatar, accountTwo } = await loadFixture(deployPrivatarFixture);
   
            await expect(privatar.getProfile(accountTwo.address)).to.be.revertedWith("Access denied");
        });

        it("Should fail if a profile is not enabled if you're not the profile owner", async () => {
            const { privatar, account, accountTwo } = await loadFixture(deployPrivatarFixture);
   
            await privatar.connect(account).updateProfile("Alice", "A real cool gal.", "", false);
            
            await expect(privatar.connect(accountTwo).getProfile(account.address)).to.be.revertedWith("Access denied");;
        });

        it("Should return a disabled profile if you're the profile owner", async () => {
          const { privatar, account } = await loadFixture(deployPrivatarFixture);
 
          await privatar.connect(account).updateProfile("Alice", "A real cool gal.", "", false);
          
          const profile = await privatar.getProfile(account.address);
          expect(profile).to.deep.equal(["Alice", "A real cool gal.", "", false]);
      });

        it("Should return a profile if it is enabled", async () => {
            const { privatar, account, accountTwo } = await loadFixture(deployPrivatarFixture);
   
            await privatar.connect(account).updateProfile("Alice", "A real cool gal.", "", true);
            
            const profile = await privatar.connect(accountTwo).getProfile(account.address);
            expect(profile).to.deep.equal(["Alice", "A real cool gal.", "", true]);
        });

        it("Should return an avatar only", async () => {
            const { privatar, account, accountTwo } = await loadFixture(deployPrivatarFixture);
   
            await privatar.connect(account).updateProfile("Alice", "A real cool gal.", "A dummy image", true);
            
            const avatar = await privatar.connect(accountTwo).getAvatar(account.address);
            expect(avatar).to.equal("A dummy image");
        });
    });
  });
  