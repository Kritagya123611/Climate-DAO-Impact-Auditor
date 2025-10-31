// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* ───────────────────────────────────────────────────────────────
 ░░ Audit Registry ░░
───────────────────────────────────────────────────────────────*/

contract AuditRegistry is AccessControl, ReentrancyGuard {

    uint256 private _auditIds;

    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    event AuditSubmitted(uint256 indexed auditId, bytes32 indexed projectId, address indexed auditor, string ipfsHash, bool success, uint256 timestamp);

    struct Audit {
        uint256 id;
        bytes32 projectId;
        address auditor;
        string ipfsHash;
        bool success;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => Audit) public audits;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function submitAudit(bytes32 projectId, string calldata ipfsHash, bool success) 
        external 
        nonReentrant 
        onlyRole(AUDITOR_ROLE) 
        returns (uint256) 
    {
        _auditIds++;
        uint256 id = _auditIds;
        audits[id] = Audit(id, projectId, msg.sender, ipfsHash, success, block.timestamp, true);
        emit AuditSubmitted(id, projectId, msg.sender, ipfsHash, success, block.timestamp);
        return id;
    }

    function submitAuditByOracle(bytes32 projectId, string calldata ipfsHash, bool success, address auditor) 
        external 
        onlyRole(ORACLE_ROLE) 
        returns (uint256) 
    {
        _auditIds++;
        uint256 id = _auditIds;
        audits[id] = Audit(id, projectId, auditor, ipfsHash, success, block.timestamp, true);
        emit AuditSubmitted(id, projectId, auditor, ipfsHash, success, block.timestamp);
        return id;
    }

    function getAudit(uint256 id) external view returns (Audit memory) {
        require(audits[id].exists, "Audit missing");
        return audits[id];
    }
}

/* ───────────────────────────────────────────────────────────────
 ░░ Carbon Credit NFT ░░
───────────────────────────────────────────────────────────────*/

contract CarbonCreditNFT is ERC721URIStorage, AccessControl {
    
    uint256 private _tokenIds;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => uint256) public auditToToken;

    event CreditMinted(uint256 indexed tokenId, uint256 indexed auditId, address indexed to);

    constructor(string memory name_, string memory symbol_, address admin) 
        ERC721(name_, symbol_) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintFromAudit(address to, uint256 auditId, string calldata tokenURI) 
        external 
        onlyRole(MINTER_ROLE) 
        returns (uint256) 
    {
        require(auditToToken[auditId] == 0, "NFT already minted for audit");

        _tokenIds++;
        uint256 newId = _tokenIds;
        _safeMint(to, newId);
        _setTokenURI(newId, tokenURI);

        auditToToken[auditId] = newId;
        emit CreditMinted(newId, auditId, to);
        return newId;
    }
}

/* ───────────────────────────────────────────────────────────────
 ░░ Impact Token (ERC20) ░░
───────────────────────────────────────────────────────────────*/

contract ImpactToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name_, string memory symbol_, address admin) 
        ERC20(name_, symbol_) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

/* ───────────────────────────────────────────────────────────────
 ░░ Climate DAO Governance ░░
───────────────────────────────────────────────────────────────*/

contract ClimateDAO is AccessControl, ReentrancyGuard {

    uint256 private _proposalIds;

    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    AuditRegistry public immutable auditRegistry;
    CarbonCreditNFT public immutable nft;
    ImpactToken public immutable token;

    uint256 public votingDuration = 3 days;

    struct Proposal {
        uint256 id;
        address proposer;
        uint256 auditId;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 start;
        uint256 end;
        bool executed;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;

    event ProposalCreated(uint256 indexed id, uint256 auditId);
    event ProposalExecuted(uint256 indexed id, uint256 tokenId);

    constructor(address admin, AuditRegistry reg, CarbonCreditNFT nft_, ImpactToken token_) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PROPOSER_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);

        auditRegistry = reg;
        nft = nft_;
        token = token_;
    }

    function propose(uint256 auditId, string calldata desc) external onlyRole(PROPOSER_ROLE) returns (uint256) {
        AuditRegistry.Audit memory a = auditRegistry.getAudit(auditId);
        require(a.exists && a.success, "Invalid audit");

        _proposalIds++;
        uint256 id = _proposalIds;

        proposals[id] = Proposal(id, msg.sender, auditId, desc, 0, 0, block.timestamp, block.timestamp + votingDuration, false, true);

        emit ProposalCreated(id, auditId);
        return id;
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(p.exists && block.timestamp <= p.end, "Voting closed");
        require(!voted[id][msg.sender], "Already voted");

        voted[id][msg.sender] = true;
        if (support) p.forVotes++;
        else p.againstVotes++;
    }

    function execute(uint256 id, string calldata uri, uint256 reward) 
        external 
        onlyRole(EXECUTOR_ROLE) 
        returns (uint256) 
    {
        Proposal storage p = proposals[id];
        require(!p.executed && block.timestamp > p.end, "Not executable");
        require(p.forVotes > p.againstVotes, "Rejected");

        uint256 tokenId = nft.mintFromAudit(p.proposer, p.auditId, uri);
        if (reward > 0) token.mint(p.proposer, reward);

        p.executed = true;
        emit ProposalExecuted(id, tokenId);
        return tokenId;
    }
}

/* ───────────────────────────────────────────────────────────────
 ░░ Project Registry + Marketplace ░░
───────────────────────────────────────────────────────────────*/

contract ProjectRegistry is ERC721URIStorage, AccessControl, ReentrancyGuard {

    uint256 private _projectIds;

    struct Project {
        uint256 id;
        uint256 basePrice;
        uint8 health;
        bool forSale;
        bool exists;
    }

    mapping(uint256 => Project) public projects;

    event ProjectRegistered(uint256 id, uint256 basePrice);
    event ProjectBought(uint256 id, address buyer, uint256 price);

    constructor(string memory name_, string memory symbol_, address admin) 
        ERC721(name_, symbol_) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function register(address owner, uint256 price, string calldata uri) external returns (uint256) {
        _projectIds++;
        uint256 id = _projectIds;

        _safeMint(owner, id);
        _setTokenURI(id, uri);

        projects[id] = Project(id, price, 0, false, true);
        emit ProjectRegistered(id, price);
        return id;
    }

    function buy(uint256 id) external payable nonReentrant {
        Project storage p = projects[id];
        require(p.exists && p.forSale, "Not for sale");

        uint256 cost = (p.basePrice * (100 + p.health)) / 100;
        require(msg.value >= cost, "Not enough ETH");

        address prev = ownerOf(id);
        _safeTransfer(prev, msg.sender, id, "");

        p.forSale = false;

        payable(prev).transfer(cost);
        if (msg.value > cost) payable(msg.sender).transfer(msg.value - cost);

        emit ProjectBought(id, msg.sender, cost);
    }
}
