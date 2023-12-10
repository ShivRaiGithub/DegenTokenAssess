//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegenToken is ERC20("Degen", "DGN"), Ownable, ERC20Burnable {
    mapping(address=>uint256[]) inventory;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burnTokens(uint256 amount) public {
        _burn(_msgSender(), amount);
    }
    
    function transferTokens(address to, uint256 amount) public {
        require(balanceOf(msg.sender)>=amount,"Not enough tokens");
        approve(msg.sender, amount);
        _transfer(msg.sender, to, amount);
    }

    function getBalance(address user) public view returns (uint256) {
        return balanceOf(user);
    }
    function showItems() public pure returns(string memory) {
        return "1:Potion,2:Cards,5:Hat";
    }
    function BuyItem(uint256 choice) public {
        require(choice<=balanceOf(msg.sender),"Not enough tokens");
        transfer(address(this), choice);
        inventory[msg.sender].push(choice);
    }
    function viewInventory() public view returns( uint256[] memory){
        return inventory[msg.sender];
    }
}
